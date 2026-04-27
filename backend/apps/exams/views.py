from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.academics.models import Subject, Unit

from apps.notifications.utils import create_notification
from db_design.constants import NotificationType
from .models import ExamPaper, ExamTemplate
from .serializers import (
	ExamPaperSerializer,
	ExamPaperWriteSerializer,
	ExamTemplateSerializer,
	ExamTemplateWriteSerializer,
	GenerateExamRequestSerializer,
	SubjectCatalogSerializer,
	UnitCatalogSerializer,
)


def _normalize_role(user):
	return str(getattr(user, "role", "") or "").strip().lower()


def _has_exam_authoring_access(user):
	return bool(user and user.is_authenticated)


def _get_exam_queryset_for_user(user):
	role = _normalize_role(user)
	queryset = ExamPaper.objects.select_related("template", "subject_ref", "created_by")
	if user.is_staff or user.is_superuser or role in {"admin", "hod"}:
		return queryset
	return queryset.filter(created_by=user)


def _get_template_queryset_for_user(user):
	role = _normalize_role(user)
	queryset = ExamTemplate.objects.select_related("created_by")
	if user.is_staff or user.is_superuser or role in {"admin", "hod"}:
		return queryset
	return queryset.filter(created_by=user)


def _build_scaffold_exam_json(*, template, subject_name, title, lesson_range, difficulty):
	pattern = template.pattern_json if isinstance(template.pattern_json, dict) else {}
	raw_sections = pattern.get("sections", [])
	sections = []

	if isinstance(raw_sections, list):
		for index, section in enumerate(raw_sections, start=1):
			name = str(section.get("name") or section.get("title") or f"Section {index}").strip()
			sections.append(
				{
					"id": str(section.get("id") or index),
					"title": name or f"Section {index}",
					"questionType": section.get("questionType") or section.get("type") or "Short Answer",
					"questionCount": section.get("questionCount") or 0,
					"marksPerQuestion": section.get("marksPerQuestion") or 0,
					"questions": [],
				}
			)

	return {
		"title": title or template.title or f"{subject_name} Question Paper",
		"subject": subject_name,
		"difficulty": difficulty,
		"lesson_range": lesson_range,
		"sections": sections,
		"instructions": "Draft scaffold saved. AI generation is not connected yet.",
	}


class ExamAuthoringPermission(IsAuthenticated):
	def has_permission(self, request, view):
		return super().has_permission(request, view) and _has_exam_authoring_access(request.user)


class ExamSubjectCatalogView(ListAPIView):
	permission_classes = [ExamAuthoringPermission]
	serializer_class = SubjectCatalogSerializer

	def get_queryset(self):
		return Subject.objects.all().order_by("name")


class ExamSubjectUnitsView(ListAPIView):
	permission_classes = [ExamAuthoringPermission]
	serializer_class = UnitCatalogSerializer

	def get_queryset(self):
		return Unit.objects.filter(subject_id=self.kwargs["subject_id"]).select_related("subject").order_by("order_index", "title")

	def list(self, request, *args, **kwargs):
		subject = Subject.objects.filter(id=self.kwargs["subject_id"]).first()
		if not subject:
			return Response({"detail": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)

		serializer = self.get_serializer(self.get_queryset(), many=True)
		return Response(
			{
				"subject": SubjectCatalogSerializer(subject).data,
				"units": serializer.data,
			}
		)


class ExamTemplateListCreateView(APIView):
	permission_classes = [ExamAuthoringPermission]

	def get(self, request):
		templates = _get_template_queryset_for_user(request.user)
		return Response(ExamTemplateSerializer(templates, many=True).data, status=status.HTTP_200_OK)

	def post(self, request):
		serializer = ExamTemplateWriteSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		exam_template = serializer.save(created_by=request.user)
		create_notification(
			user=request.user,
			title="Exam Template Created",
			message=f"Exam template '{exam_template.title}' was created successfully.",
			notification_type=NotificationType.SUCCESS,
			metadata={"template_id": str(exam_template.id), "action": "exam_template_created"},
			created_by=request.user,
		)
		return Response(ExamTemplateSerializer(exam_template).data, status=status.HTTP_201_CREATED)


class ExamListView(APIView):
	permission_classes = [ExamAuthoringPermission]

	def get(self, request):
		queryset = _get_exam_queryset_for_user(request.user)
		status_filter = str(request.query_params.get("status") or "").strip().lower()
		if status_filter:
			queryset = queryset.filter(status=status_filter)
		return Response(ExamPaperSerializer(queryset, many=True).data, status=status.HTTP_200_OK)


class GenerateExamView(APIView):
	permission_classes = [ExamAuthoringPermission]

	def post(self, request):
		request_serializer = GenerateExamRequestSerializer(data=request.data)
		request_serializer.is_valid(raise_exception=True)
		validated = request_serializer.validated_data
		template = validated["template"]
		subject = validated["subject_ref"]
		lesson_range = validated.get("lesson_range") or {}
		title = str(validated.get("title") or "").strip() or f"{subject.name} Question Paper"
		exam_json = validated.get("exam_json") or _build_scaffold_exam_json(
			template=template,
			subject_name=subject.name,
			title=title,
			lesson_range=lesson_range,
			difficulty=validated.get("difficulty", "Medium"),
		)

		exam_paper = ExamPaper.objects.create(
			title=title,
			subject=subject.name,
			subject_ref=subject,
			lesson_range=lesson_range,
			difficulty=validated.get("difficulty", "Medium"),
			template=template,
			exam_json=exam_json,
			status=ExamPaper.Status.DRAFT,
			created_by=request.user,
		)
		create_notification(
			user=request.user,
			title="Exam Draft Generated",
			message=f"A new exam draft '{exam_paper.title}' was generated successfully.",
			notification_type=NotificationType.SUCCESS,
			metadata={"exam_id": str(exam_paper.id), "action": "exam_draft_generated"},
			created_by=request.user,
		)
		return Response(ExamPaperSerializer(exam_paper).data, status=status.HTTP_201_CREATED)


class ExamDetailView(APIView):
	permission_classes = [ExamAuthoringPermission]

	def get_object(self, request, exam_id):
		return _get_exam_queryset_for_user(request.user).filter(id=exam_id).first()

	def get(self, request, id):
		exam_paper = self.get_object(request, id)
		if not exam_paper:
			return Response({"detail": "Exam paper not found."}, status=status.HTTP_404_NOT_FOUND)
		return Response(ExamPaperSerializer(exam_paper).data, status=status.HTTP_200_OK)

	def put(self, request, id):
		exam_paper = self.get_object(request, id)
		if not exam_paper:
			return Response({"detail": "Exam paper not found."}, status=status.HTTP_404_NOT_FOUND)
		serializer = ExamPaperWriteSerializer(exam_paper, data=request.data)
		serializer.is_valid(raise_exception=True)
		exam_paper = serializer.save()
		return Response(ExamPaperSerializer(exam_paper).data, status=status.HTTP_200_OK)

	def patch(self, request, id):
		exam_paper = self.get_object(request, id)
		if not exam_paper:
			return Response({"detail": "Exam paper not found."}, status=status.HTTP_404_NOT_FOUND)
		serializer = ExamPaperWriteSerializer(exam_paper, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		exam_paper = serializer.save()
		return Response(ExamPaperSerializer(exam_paper).data, status=status.HTTP_200_OK)


class PublishExamView(APIView):
	permission_classes = [ExamAuthoringPermission]

	def post(self, request, id):
		exam_paper = _get_exam_queryset_for_user(request.user).filter(id=id).first()
		if not exam_paper:
			return Response({"detail": "Exam paper not found."}, status=status.HTTP_404_NOT_FOUND)

		exam_paper.status = ExamPaper.Status.PUBLISHED
		exam_paper.save(update_fields=["status", "updated_at"])
		create_notification(
			user=request.user,
			title="Exam Published",
			message=f"Exam '{exam_paper.title}' was published successfully.",
			notification_type=NotificationType.SUCCESS,
			metadata={"exam_id": str(exam_paper.id), "action": "exam_published"},
			created_by=request.user,
		)
		return Response(ExamPaperSerializer(exam_paper).data, status=status.HTTP_200_OK)
