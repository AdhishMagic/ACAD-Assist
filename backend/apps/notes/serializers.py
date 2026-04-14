from rest_framework import serializers

from apps.files.models import File
from apps.files.services import derive_title_from_content

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
	file_id = serializers.UUIDField(source="file.id", read_only=True)
	file_url = serializers.SerializerMethodField()
	file_name = serializers.SerializerMethodField()
	file_type = serializers.SerializerMethodField()
	created_by_email = serializers.SerializerMethodField()
	created_by_name = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	class Meta:
		model = Note
		fields = (
			"id",
			"title",
			"content",
			"file",
			"file_id",
			"file_url",
			"file_name",
			"file_type",
			"is_published",
			"status",
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
		return "published" if obj.is_published else "draft"


class NoteSaveSerializer(serializers.Serializer):
	note_id = serializers.UUIDField(required=False)
	file_id = serializers.UUIDField()
	title = serializers.CharField(max_length=255, required=False, allow_blank=True)
	content = serializers.CharField()
	is_published = serializers.BooleanField(default=False)

	def validate_file_id(self, value):
		request = self.context["request"]
		file_instance = File.objects.filter(id=value, uploaded_by=request.user).first()
		if not file_instance:
			raise serializers.ValidationError("The referenced file was not found.")
		return value

	def validate_content(self, value):
		if not value or not value.strip():
			raise serializers.ValidationError("Content cannot be empty.")
		return value.strip()

	def validate(self, attrs):
		request = self.context["request"]
		file_instance = File.objects.filter(id=attrs["file_id"], uploaded_by=request.user).first()
		attrs["file_instance"] = file_instance

		note_id = attrs.get("note_id")
		if note_id:
			note = Note.objects.filter(id=note_id, created_by=request.user).first()
			if not note:
				raise serializers.ValidationError({"note_id": "The note was not found."})
			attrs["note_instance"] = note
		return attrs

	def create(self, validated_data):
		request = self.context["request"]
		file_instance = validated_data["file_instance"]
		content = validated_data["content"]
		title = validated_data.get("title") or derive_title_from_content(content, getattr(file_instance, "original_name", ""))
		is_published = bool(validated_data.get("is_published", False))

		note = validated_data.get("note_instance")
		if note:
			note.file = file_instance
			note.title = title
			note.content = content
			note.is_published = is_published
			note.save(update_fields=["file", "title", "content", "is_published", "updated_at"])
			return note

		return Note.objects.create(
			file=file_instance,
			title=title,
			content=content,
			is_published=is_published,
			created_by=request.user,
		)