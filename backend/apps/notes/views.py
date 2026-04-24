from uuid import UUID

from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Note
from .serializers import NoteSerializer, NoteWriteSerializer, get_note_approval_status


def _is_admin_or_hod(user):
	role = (getattr(user, "role", "") or "").lower()
	return role in {"admin", "hod"}


def _apply_subject_filter(queryset, subject_value):
	if not subject_value:
		return queryset

	filter_query = Q(subject__name__icontains=subject_value) | Q(subject__code__icontains=subject_value)

	try:
		UUID(str(subject_value))
	except (TypeError, ValueError, AttributeError):
		return queryset.filter(filter_query)

	return queryset.filter(filter_query | Q(subject__id=subject_value))


def _normalize_tags(query_params):
	raw_tags = query_params.getlist("tags")
	if not raw_tags:
		raw_value = (query_params.get("tags") or "").strip()
		raw_tags = [raw_value] if raw_value else []

	normalized = []
	for value in raw_tags:
		for tag in str(value).split(","):
			tag = tag.strip()
			if tag:
				normalized.append(tag)
	return normalized


def _set_approval_status(note, approval_status, *, published=False, reviewer=None):
	metadata = dict(note.metadata or {})
	metadata["approval_status"] = approval_status
	metadata["approval_updated_at"] = timezone.now().isoformat()
	if reviewer is not None:
		metadata["approval_updated_by"] = getattr(reviewer, "email", None) or str(getattr(reviewer, "id", ""))
	note.metadata = metadata
	note.is_published = published


class NotesListCreateView(ListCreateAPIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	serializer_class = NoteSerializer

	def get_queryset(self):
		queryset = Note.objects.filter(is_published=True).select_related("file", "created_by", "subject")
		search = (self.request.query_params.get("search") or self.request.query_params.get("q") or "").strip()
		subject = (self.request.query_params.get("subject") or "").strip()
		tags = _normalize_tags(self.request.query_params)

		if search:
			queryset = queryset.filter(
				Q(title__icontains=search)
				| Q(content__icontains=search)
				| Q(subject__name__icontains=search)
				| Q(subject__code__icontains=search)
				| Q(tags__icontains=search)
			)

		queryset = _apply_subject_filter(queryset, subject)

		for tag in tags:
			queryset = queryset.filter(tags__icontains=tag)

		sort = (self.request.query_params.get("sort") or "newest").lower()
		if sort == "oldest":
			queryset = queryset.order_by("created_at")
		else:
			queryset = queryset.order_by("-created_at")

		return queryset

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context

	def get_serializer_class(self):
		if self.request.method == "POST":
			return NoteWriteSerializer
		return NoteSerializer

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		note = serializer.save()
		response = NoteSerializer(note, context={"request": request}).data
		return Response(response, status=status.HTTP_201_CREATED)


class MyNotesListView(ListAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = NoteSerializer

	def get_queryset(self):
		queryset = Note.objects.select_related("file", "created_by", "subject")
		scope = (self.request.query_params.get("scope") or "").strip().lower()
		approval_status = (self.request.query_params.get("approval_status") or "").strip().lower()
		if _is_admin_or_hod(self.request.user) and scope == "review":
			if approval_status and approval_status != "all":
				if approval_status == "published":
					queryset = queryset.filter(is_published=True)
				elif approval_status == "draft":
					queryset = queryset.filter(is_published=False).exclude(metadata__approval_status__in=["pending", "rejected", "revision_requested", "approved"])
				else:
					queryset = queryset.filter(metadata__approval_status=approval_status)
			else:
				queryset = queryset.filter(
					Q(is_published=True)
					| Q(metadata__approval_status__in=["pending", "rejected", "revision_requested", "approved"])
				)
		else:
			queryset = queryset.filter(created_by=self.request.user)
		search = (self.request.query_params.get("search") or self.request.query_params.get("q") or "").strip()
		if search:
			queryset = queryset.filter(
				Q(title__icontains=search)
				| Q(content__icontains=search)
				| Q(subject__name__icontains=search)
				| Q(subject__code__icontains=search)
				| Q(tags__icontains=search)
			)

		queryset = _apply_subject_filter(queryset, (self.request.query_params.get("subject") or "").strip())

		sort = (self.request.query_params.get("sort") or "newest").lower()
		if sort == "oldest":
			queryset = queryset.order_by("created_at")
		return queryset

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context


class NoteDetailView(RetrieveUpdateAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = NoteSerializer
	parser_classes = [MultiPartParser, FormParser, JSONParser]
	lookup_field = "pk"

	def get_queryset(self):
		return Note.objects.select_related("file", "created_by", "subject")

	def get_serializer_class(self):
		if self.request.method in {"PATCH", "PUT"}:
			return NoteWriteSerializer
		return NoteSerializer

	def _can_access(self, note):
		if note.is_published:
			return True
		if note.created_by_id == self.request.user.id:
			return True
		return _is_admin_or_hod(self.request.user)

	def retrieve(self, request, *args, **kwargs):
		note = self.get_object()
		if not self._can_access(note):
			return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
		return Response(NoteSerializer(note, context={"request": request}).data)

	def partial_update(self, request, *args, **kwargs):
		note = self.get_object()
		if note.created_by_id != request.user.id and not _is_admin_or_hod(request.user):
			return Response({"detail": "You do not have permission to edit this note."}, status=status.HTTP_403_FORBIDDEN)
		serializer = self.get_serializer(note, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		note = serializer.save()
		return Response(NoteSerializer(note, context={"request": request}).data)

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context


class NotePublishView(APIView):
	permission_classes = [IsAuthenticated]

	def patch(self, request, pk):
		note = Note.objects.select_related("file", "created_by", "subject").filter(pk=pk).first()
		if not note:
			return Response({"detail": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

		if note.created_by_id != request.user.id and not _is_admin_or_hod(request.user):
			return Response({"detail": "You do not have permission to publish this note."}, status=status.HTTP_403_FORBIDDEN)

		action = str(request.data.get("action") or request.query_params.get("action") or "").strip().lower()
		is_reviewer = _is_admin_or_hod(request.user)

		if is_reviewer:
			if action == "reject":
				_set_approval_status(note, "rejected", published=False, reviewer=request.user)
			elif action in {"revision", "request_revision", "request-revision", "revision_requested"}:
				_set_approval_status(note, "revision_requested", published=False, reviewer=request.user)
			else:
				_set_approval_status(note, "approved", published=True, reviewer=request.user)
		else:
			current_status = get_note_approval_status(note)
			if current_status == "published" and note.created_by_id == request.user.id and not _is_admin_or_hod(request.user):
				return Response({"detail": "This note is already approved and published."}, status=status.HTTP_400_BAD_REQUEST)
			_set_approval_status(note, "pending", published=False, reviewer=request.user)

		note.save(update_fields=["metadata", "is_published", "updated_at"])
		return Response(NoteSerializer(note, context={"request": request}).data, status=status.HTTP_200_OK)


class NotesSubjectListView(ListAPIView):
	permission_classes = [IsAuthenticated]

	def get(self, request):
		notes = Note.objects.filter(is_published=True).select_related("subject")
		subject_counts = {}
		for note in notes:
			subject_name = getattr(note.subject, "name", "General") or "General"
			subject_key = str(getattr(note.subject, "id", "general"))
			entry = subject_counts.get(subject_key)
			if entry is None:
				subject_counts[subject_key] = {
					"id": subject_key,
					"name": subject_name,
					"code": getattr(note.subject, "code", None),
					"count": 1,
				}
			else:
				entry["count"] += 1

		results = sorted(subject_counts.values(), key=lambda item: item["name"].lower())
		return Response(results)


class BookmarkedNotesListView(ListAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = NoteSerializer

	def get_queryset(self):
		"""Get all notes bookmarked by the current user"""
		return self.request.user.bookmarked_notes.select_related("file", "created_by", "subject")

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context


class BookmarkNoteView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, pk):
		"""Toggle bookmark for a note"""
		note = Note.objects.select_related("file", "created_by", "subject").filter(pk=pk).first()
		if not note:
			return Response({"detail": "Note not found."}, status=status.HTTP_404_NOT_FOUND)

		# Toggle bookmark
		user = request.user
		is_bookmarked = user.bookmarked_notes.filter(pk=pk).exists()
		
		if is_bookmarked:
			user.bookmarked_notes.remove(note)
		else:
			user.bookmarked_notes.add(note)

		# Return updated note with bookmark status
		serialized = NoteSerializer(note, context={"request": request}).data
		serialized['is_bookmarked'] = not is_bookmarked  # Return new state
		return Response(serialized, status=status.HTTP_200_OK)
