from pathlib import Path

from rest_framework import serializers

from .models import StudyMaterial, StudyMaterialFileType, StudyMaterialStatus

ALLOWED_EXTENSIONS = {
    ".pdf": StudyMaterialFileType.PDF,
    ".doc": StudyMaterialFileType.DOC,
    ".docx": StudyMaterialFileType.DOCX,
    ".txt": StudyMaterialFileType.TXT,
}


class StudyMaterialSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, allow_null=True, use_url=True)
    file_url = serializers.SerializerMethodField()
    file_path = serializers.SerializerMethodField()
    uploaded_by_email = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = (
            "id",
            "title",
            "content",
            "file",
            "file_url",
            "file_path",
            "file_type",
            "uploaded_by",
            "uploaded_by_email",
            "author_name",
            "is_bookmarked",
            "status",
            "is_public",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "uploaded_by",
            "uploaded_by_email",
            "is_bookmarked",
            "author_name",
            "file_type",
            "status",
            "is_public",
            "created_at",
            "updated_at",
            "file_url",
            "file_path",
        )

    def validate_file(self, value):
        suffix = Path(value.name).suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Only PDF, DOC, DOCX, and TXT files are allowed.")
        return value

    def create(self, validated_data):
        upload = validated_data.get("file")
        if upload:
            suffix = Path(upload.name).suffix.lower()
            validated_data["file_type"] = ALLOWED_EXTENSIONS[suffix]
        else:
            validated_data["file_type"] = StudyMaterialFileType.TXT

        validated_data["status"] = StudyMaterialStatus.DRAFT
        validated_data["is_public"] = False

        return StudyMaterial.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if "file" in validated_data:
            upload = validated_data.get("file")
            if upload:
                suffix = Path(upload.name).suffix.lower()
                validated_data["file_type"] = ALLOWED_EXTENSIONS[suffix]
            else:
                validated_data["file_type"] = StudyMaterialFileType.TXT

        return super().update(instance, validated_data)

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url

    def get_file_path(self, obj):
        return obj.file.name if obj.file else None

    def get_uploaded_by_email(self, obj):
        return getattr(obj.uploaded_by, "email", None)

    def get_author_name(self, obj):
        first = getattr(obj.uploaded_by, "first_name", "") or ""
        last = getattr(obj.uploaded_by, "last_name", "") or ""
        full = f"{first} {last}".strip()
        return full or getattr(obj.uploaded_by, "email", None)

    def get_is_bookmarked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        prefetched_user_ids = getattr(obj, "bookmarked_user_ids", None)
        if prefetched_user_ids is not None:
            return request.user.id in prefetched_user_ids

        return obj.bookmarks.filter(user=request.user).exists()
