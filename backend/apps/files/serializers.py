from pathlib import Path

from rest_framework import serializers

from .models import File
from .services import (
	MAX_UPLOAD_SIZE_BYTES,
	build_exam_template_suggestion,
	build_upload_metadata,
	compute_checksum,
	detect_file_type,
	extract_editable_content,
)


class FileSerializer(serializers.ModelSerializer):
	file_id = serializers.UUIDField(source="id", read_only=True)
	file_url = serializers.SerializerMethodField()
	uploaded_by_email = serializers.SerializerMethodField()
	uploaded_by_name = serializers.SerializerMethodField()

	class Meta:
		model = File
		fields = (
			"id",
			"file_id",
			"file",
			"file_url",
			"file_type",
			"uploaded_by",
			"uploaded_by_email",
			"uploaded_by_name",
			"is_editable",
			"original_name",
			"storage_path",
			"checksum",
			"mime_type",
			"size_bytes",
			"created_at",
		)
		read_only_fields = fields

	def get_file_url(self, obj):
		if not obj.file:
			return None
		request = self.context.get("request")
		url = obj.file.url
		return request.build_absolute_uri(url) if request else url

	def get_uploaded_by_email(self, obj):
		return getattr(obj.uploaded_by, "email", None)

	def get_uploaded_by_name(self, obj):
		first = getattr(obj.uploaded_by, "first_name", "") or ""
		last = getattr(obj.uploaded_by, "last_name", "") or ""
		full_name = f"{first} {last}".strip()
		return full_name or getattr(obj.uploaded_by, "email", None)


class FileUploadSerializer(serializers.ModelSerializer):
	file = serializers.FileField(write_only=True)
	extracted_content = serializers.SerializerMethodField()
	title_suggestion = serializers.SerializerMethodField()
	template_suggestion = serializers.SerializerMethodField()
	file_id = serializers.UUIDField(source="id", read_only=True)
	file_url = serializers.SerializerMethodField()

	class Meta:
		model = File
		fields = (
			"id",
			"file_id",
			"file",
			"file_url",
			"file_type",
			"uploaded_by",
			"is_editable",
			"original_name",
			"size_bytes",
			"mime_type",
			"created_at",
			"extracted_content",
			"title_suggestion",
			"template_suggestion",
		)
		read_only_fields = (
			"id",
			"file_id",
			"file_url",
			"file_type",
			"uploaded_by",
			"is_editable",
			"original_name",
			"size_bytes",
			"mime_type",
			"created_at",
			"extracted_content",
			"title_suggestion",
			"template_suggestion",
		)

	def validate_file(self, value):
		if value.size > MAX_UPLOAD_SIZE_BYTES:
			raise serializers.ValidationError("File size cannot exceed 10MB.")
		detect_file_type(value.name)
		return value

	def create(self, validated_data):
		uploaded_file = validated_data.pop("file")
		file_type = detect_file_type(uploaded_file.name)
		metadata = build_upload_metadata(uploaded_file)
		content = extract_editable_content(uploaded_file, file_type) if file_type in {"pdf", "docx", "txt"} else ""
		title_suggestion = Path(uploaded_file.name or "").stem[:255] or "Untitled Note"
		if content:
			first_line = next((line.strip() for line in content.splitlines() if line.strip()), "")
			if first_line:
				title_suggestion = first_line[:255]
		template_suggestion = build_exam_template_suggestion(content, uploaded_file.name)
		checksum = compute_checksum(uploaded_file)
		metadata.update(
			{
				"extracted_content": content,
				"title_suggestion": title_suggestion,
				"template_suggestion": template_suggestion,
			}
		)

		instance = File.objects.create(
			file=uploaded_file,
			file_type=file_type,
			uploaded_by=self.context["request"].user,
			is_editable=bool(content),
			original_name=uploaded_file.name,
			storage_path=uploaded_file.name,
			checksum=checksum,
			mime_type=metadata["mime_type"],
			size_bytes=metadata["size_bytes"],
			metadata=metadata,
		)
		self._editable_content = content
		return instance

	def get_extracted_content(self, obj):
		if hasattr(self, "_editable_content"):
			return getattr(self, "_editable_content", "")
		return (obj.metadata or {}).get("extracted_content", "")

	def get_title_suggestion(self, obj):
		if hasattr(self, "_editable_content"):
			content = getattr(self, "_editable_content", "")
			if content:
				first_line = next((line.strip() for line in content.splitlines() if line.strip()), "")
				if first_line:
					return first_line[:255]
		metadata = obj.metadata or {}
		if metadata.get("title_suggestion"):
			return metadata["title_suggestion"][:255]
		return Path(obj.original_name or "").stem[:255] or "Untitled Note"

	def get_template_suggestion(self, obj):
		metadata = obj.metadata or {}
		if metadata.get("template_suggestion"):
			return metadata["template_suggestion"]
		content = self.get_extracted_content(obj)
		return build_exam_template_suggestion(content, obj.original_name)

	def get_file_url(self, obj):
		if not obj.file:
			return None
		request = self.context.get("request")
		url = obj.file.url
		return request.build_absolute_uri(url) if request else url
