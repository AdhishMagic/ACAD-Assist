from rest_framework import serializers

from apps.academics.models import Subject, Unit

from .models import ExamPaper, ExamTemplate


def normalize_difficulty_value(value):
	text = str(value or "").strip().lower()
	if text == "easy":
		return "Easy"
	if text == "hard":
		return "Hard"
	return "Medium"


class FlexibleLessonRangeField(serializers.Field):
	def to_internal_value(self, data):
		if data in (None, ""):
			return {}
		if isinstance(data, dict):
			return data
		if isinstance(data, str):
			text = data.strip()
			if not text:
				return {}
			return {
				"legacy_text": text,
				"selected_units": [text],
			}
		raise serializers.ValidationError("Lesson range must be an object or string.")

	def to_representation(self, value):
		return value or {}


class SubjectCatalogSerializer(serializers.ModelSerializer):
	class Meta:
		model = Subject
		fields = ("id", "name", "code")


class UnitCatalogSerializer(serializers.ModelSerializer):
	label = serializers.SerializerMethodField()

	class Meta:
		model = Unit
		fields = ("id", "code", "title", "order_index", "label")

	def get_label(self, obj):
		return f"{obj.order_index}. {obj.title}"


class ExamTemplateSerializer(serializers.ModelSerializer):
	section_count = serializers.SerializerMethodField()

	class Meta:
		model = ExamTemplate
		fields = ("id", "title", "pattern_json", "section_count", "created_by", "created_at", "updated_at")
		read_only_fields = ("id", "created_by", "created_at", "updated_at", "section_count")

	def get_section_count(self, obj):
		sections = obj.pattern_json.get("sections", []) if isinstance(obj.pattern_json, dict) else []
		return len(sections) if isinstance(sections, list) else 0


class ExamTemplateWriteSerializer(serializers.ModelSerializer):
	class Meta:
		model = ExamTemplate
		fields = ("title", "pattern_json")

	def validate_pattern_json(self, value):
		if value is None:
			return {"sections": []}
		if not isinstance(value, dict):
			raise serializers.ValidationError("Pattern JSON must be an object.")
		if "sections" in value and not isinstance(value.get("sections"), list):
			raise serializers.ValidationError("Pattern JSON sections must be a list.")
		return value


class LessonRangeSerializer(serializers.Serializer):
	subject_id = serializers.UUIDField(required=False)
	subject_name = serializers.CharField(required=False, allow_blank=True, default="")
	start_unit = serializers.CharField(required=False, allow_blank=True, default="")
	end_unit = serializers.CharField(required=False, allow_blank=True, default="")
	selected_units = serializers.ListField(child=serializers.CharField(), required=False, default=list)


class GenerateExamRequestSerializer(serializers.Serializer):
	template = serializers.PrimaryKeyRelatedField(queryset=ExamTemplate.objects.all())
	subject_id = serializers.UUIDField(required=False)
	subject = serializers.CharField(required=False, allow_blank=True, default="")
	title = serializers.CharField(required=False, allow_blank=True, default="")
	difficulty = serializers.CharField(required=False, allow_blank=True, default="Medium")
	lesson_range = FlexibleLessonRangeField(required=False, default=dict)
	exam_json = serializers.JSONField(required=False, default=dict)

	def validate(self, attrs):
		subject_id = attrs.get("subject_id")
		subject_name = str(attrs.get("subject") or "").strip()

		subject = None
		if subject_id:
			subject = Subject.objects.filter(id=subject_id).first()
			if not subject:
				raise serializers.ValidationError({"subject_id": "Selected subject was not found."})
		elif subject_name:
			subject = Subject.objects.filter(code__iexact=subject_name).first() or Subject.objects.filter(name__iexact=subject_name).first()

		if not subject:
			raise serializers.ValidationError({"subject": "A valid subject selection is required."})

		attrs["subject_ref"] = subject

		lesson_range = attrs.get("lesson_range") or {}
		if isinstance(lesson_range, dict):
			lesson_range.setdefault("subject_id", str(subject.id))
			lesson_range.setdefault("subject_name", subject.name)

		attrs["difficulty"] = normalize_difficulty_value(attrs.get("difficulty"))

		return attrs


class ExamPaperSerializer(serializers.ModelSerializer):
	subject_ref = SubjectCatalogSerializer(read_only=True)
	template = ExamTemplateSerializer(read_only=True)

	class Meta:
		model = ExamPaper
		fields = (
			"id",
			"title",
			"subject",
			"subject_ref",
			"lesson_range",
			"difficulty",
			"template",
			"exam_json",
			"status",
			"created_by",
			"created_at",
			"updated_at",
		)
		read_only_fields = ("id", "created_by", "created_at", "updated_at", "subject_ref", "template")


class ExamPaperWriteSerializer(serializers.ModelSerializer):
	template = serializers.PrimaryKeyRelatedField(queryset=ExamTemplate.objects.all())
	subject_id = serializers.UUIDField(write_only=True, required=False)
	lesson_range = FlexibleLessonRangeField(required=False)

	class Meta:
		model = ExamPaper
		fields = ("title", "subject", "subject_id", "lesson_range", "difficulty", "template", "exam_json", "status")

	def validate(self, attrs):
		subject_id = attrs.pop("subject_id", None)
		subject_name = str(attrs.get("subject") or "").strip()

		subject = None
		if subject_id:
			subject = Subject.objects.filter(id=subject_id).first()
			if not subject:
				raise serializers.ValidationError({"subject_id": "Selected subject was not found."})
		elif subject_name:
			subject = Subject.objects.filter(code__iexact=subject_name).first() or Subject.objects.filter(name__iexact=subject_name).first()
		elif self.instance is not None:
			subject = self.instance.subject_ref
			subject_name = self.instance.subject

		if not subject:
			raise serializers.ValidationError({"subject": "A valid subject is required."})

		attrs["subject_ref"] = subject
		attrs["subject"] = subject_name or subject.name
		if "difficulty" in attrs:
			attrs["difficulty"] = normalize_difficulty_value(attrs.get("difficulty"))
		return attrs
