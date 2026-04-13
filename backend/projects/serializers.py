from pathlib import Path

from rest_framework import serializers

from .models import Project, ProjectStatus

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".zip"}


class ProjectSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("id", "title", "description", "file")
        read_only_fields = ("id",)

    def validate_file(self, value):
        suffix = Path(value.name).suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Only PDF, DOCX, and ZIP files are allowed.")

        if value.size > MAX_FILE_SIZE_BYTES:
            raise serializers.ValidationError("File size cannot exceed 50MB.")

        return value

    def create(self, validated_data):
        return Project.objects.create(
            student=self.context["request"].user,
            status=ProjectStatus.PENDING,
            **validated_data,
        )


class ProjectSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=True)
    student_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "file",
            "student",
            "student_name",
            "status",
            "created_at",
            "reviewed_by",
            "reviewed_by_name",
            "reviewed_at",
        )
        read_only_fields = fields

    def get_student_name(self, obj):
        full_name = f"{obj.student.first_name} {obj.student.last_name}".strip()
        return full_name or obj.student.email

    def get_reviewed_by_name(self, obj):
        if not obj.reviewed_by:
            return None
        full_name = f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip()
        return full_name or obj.reviewed_by.email
