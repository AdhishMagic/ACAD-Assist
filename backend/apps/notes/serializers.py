import json
from uuid import UUID

from django.utils.text import slugify
from rest_framework import serializers

from apps.academics.models import Subject
from apps.files.models import File
from apps.files.services import build_upload_metadata, compute_checksum, detect_file_type

from .models import Note


def get_note_approval_status(note):
	metadata = getattr(note, "metadata", {}) or {}
	approval_status = str(metadata.get("approval_status") or "").strip().lower()

	if getattr(note, "is_published", False) or approval_status == "approved":
		return "published"
	if approval_status == "pending":
		return "pending"
	if approval_status == "rejected":
		return "rejected"
	if approval_status in {"revision_requested", "revision requested"}:
		return "revision_requested"
	return "draft"


class NoteSerializer(serializers.ModelSerializer):
	file_id = serializers.UUIDField(source="file.id", read_only=True)
	file_url = serializers.SerializerMethodField()
	file_name = serializers.SerializerMethodField()
	file_type = serializers.SerializerMethodField()
	created_by_email = serializers.SerializerMethodField()
	created_by_name = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()
	subject_name = serializers.SerializerMethodField()
	subject_code = serializers.SerializerMethodField()
	type = serializers.CharField(source="note_type", read_only=True)
	is_bookmarked = serializers.SerializerMethodField()

	class Meta:
		model = Note
		fields = (
			"id",
			"title",
			"content",
			"subject",
			"subject_name",
			"subject_code",
			"tags",
			"note_type",
			"type",
			"file",
			"file_id",
			"file_url",
			"file_name",
			"file_type",
			"is_published",
			"status",
			"is_bookmarked",
			"created_by",
			"created_by_email",
			"created_by_name",
			"created_at",
			"updated_at",
		)
		read_only_fields = fields

	def get_file_url(self, obj):
		if not obj.file or not obj.file.file:
			return None
		request = self.context.get("request")
		url = obj.file.file.url
		return request.build_absolute_uri(url) if request else url

	def get_file_name(self, obj):
		return getattr(obj.file, "original_name", None)

	def get_file_type(self, obj):
		return getattr(obj.file, "file_type", None)

	def get_created_by_email(self, obj):
		return getattr(obj.created_by, "email", None)

	def get_created_by_name(self, obj):
		first = getattr(obj.created_by, "first_name", "") or ""
		last = getattr(obj.created_by, "last_name", "") or ""
		full_name = f"{first} {last}".strip()
		return full_name or getattr(obj.created_by, "email", None)

	def get_status(self, obj):
		return get_note_approval_status(obj)

	def get_subject_name(self, obj):
		return getattr(obj.subject, "name", None)

	def get_subject_code(self, obj):
		return getattr(obj.subject, "code", None)

	def get_is_bookmarked(self, obj):
		request = self.context.get("request")
		if not request or not request.user or not request.user.is_authenticated:
			return False
		return request.user.bookmarked_notes.filter(pk=obj.pk).exists()


class NoteWriteSerializer(serializers.ModelSerializer):
	file_id = serializers.UUIDField(required=False, write_only=True)
	subject = serializers.CharField(required=False, allow_blank=True, write_only=True)
	file = serializers.FileField(required=False, allow_null=True, write_only=True)
	subject_input = serializers.CharField(required=False, allow_blank=True, write_only=True)
	uploaded_file = serializers.FileField(required=False, allow_null=True, write_only=True)
	content = serializers.CharField(required=False, allow_blank=True)
	note_type = serializers.CharField(required=False, allow_blank=True)
	tags = serializers.JSONField(required=False)
	is_published = serializers.BooleanField(required=False, default=False)

	class Meta:
		model = Note
		fields = (
			"title",
			"content",
			"file_id",
			"subject",
			"subject_input",
			"tags",
			"note_type",
			"is_published",
			"file",
			"uploaded_file",
		)

	def _resolve_subject(self, value):
		if not value:
			return None
		normalized = str(value).strip()
		if not normalized:
			return None
		existing = Subject.objects.filter(code__iexact=normalized).first() or Subject.objects.filter(name__iexact=normalized).first()
		if not existing:
			try:
				UUID(normalized)
			except (TypeError, ValueError, AttributeError):
				UUID_value = None
			else:
				UUID_value = normalized

			if UUID_value:
				existing = Subject.objects.filter(id=UUID_value).first()
		if existing:
			return existing

		code = slugify(normalized)[:30] or normalized[:30]
		subject, _ = Subject.objects.get_or_create(code=code, defaults={"name": normalized})
		if subject.name != normalized and normalized:
			subject.name = normalized
			subject.save(update_fields=["name"])
		return subject

	def _create_file_record(self, uploaded_file):
		if not uploaded_file:
			return None

		file_type = detect_file_type(uploaded_file.name)
		if file_type not in {"pdf", "docx"}:
			raise serializers.ValidationError({"uploaded_file": "Only PDF and DOCX files are allowed for notes."})

		metadata = build_upload_metadata(uploaded_file)
		checksum = compute_checksum(uploaded_file)
		request = self.context["request"]
		return File.objects.create(
			file=uploaded_file,
			file_type=file_type,
			uploaded_by=request.user,
			is_editable=file_type == "docx",
			original_name=uploaded_file.name,
			storage_path=uploaded_file.name,
			checksum=checksum,
			mime_type=metadata["mime_type"],
			size_bytes=metadata["size_bytes"],
			metadata=metadata,
		)

	def validate_tags(self, value):
		if value is None:
			return []
		if isinstance(value, str):
			try:
				value = json.loads(value)
			except json.JSONDecodeError:
				value = [part.strip() for part in value.split(",") if part.strip()]
		if not isinstance(value, list):
			raise serializers.ValidationError("Tags must be a list or JSON array.")
		normalized = []
		for tag in value:
			item = str(tag or "").strip()
			if item:
				normalized.append(item)
		return normalized

	def validate(self, attrs):
		file_id = attrs.pop("file_id", None)
		subject_value = attrs.pop("subject", None)
		subject_input = attrs.pop("subject_input", None)
		if not subject_value and subject_input is not None:
			subject_value = subject_input
		attrs["subject"] = self._resolve_subject(subject_value)
		if file_id and not attrs.get("file") and not attrs.get("uploaded_file"):
			attrs["file"] = File.objects.filter(id=file_id).first()

		content = (attrs.get("content") or "").strip()
		uploaded_file = attrs.get("file") or attrs.get("uploaded_file")
		if not content and not uploaded_file:
			attrs["content"] = ""

		if attrs.get("note_type") is not None:
			attrs["note_type"] = str(attrs.get("note_type") or "").strip() or "Lecture"

		if attrs.get("title") is not None:
			attrs["title"] = str(attrs.get("title") or "").strip()

		if self.instance is None and not attrs.get("title"):
			raise serializers.ValidationError({"title": "Title is required."})

		if "content" in attrs:
			attrs["content"] = content

		return attrs

	def create(self, validated_data):
		requested_publish = bool(validated_data.pop("is_published", False))
		uploaded_file = validated_data.pop("file", None) or validated_data.pop("uploaded_file", None)
		validated_data["is_published"] = False
		validated_data["created_by"] = self.context["request"].user
		validated_data["metadata"] = {
			**(validated_data.get("metadata") or {}),
			"approval_status": "pending" if requested_publish else "draft",
		}
		if uploaded_file:
			validated_data["file"] = self._create_file_record(uploaded_file)
		if not validated_data.get("note_type"):
			validated_data["note_type"] = "Lecture"
		if "tags" not in validated_data:
			validated_data["tags"] = []
		return super().create(validated_data)

	def update(self, instance, validated_data):
		requested_publish = validated_data.pop("is_published", None)
		uploaded_file = validated_data.pop("file", None) or validated_data.pop("uploaded_file", None)
		if uploaded_file:
			validated_data["file"] = self._create_file_record(uploaded_file)
		if "note_type" in validated_data:
			validated_data["note_type"] = validated_data["note_type"] or instance.note_type or "Lecture"
		if requested_publish is not None:
			metadata = dict(instance.metadata or {})
			metadata["approval_status"] = "pending" if requested_publish else "draft"
			validated_data["metadata"] = metadata
			validated_data["is_published"] = False
		return super().update(instance, validated_data)


class NotePublishSerializer(serializers.ModelSerializer):
	class Meta:
		model = Note
		fields = ("is_published",)
		read_only_fields = fields
