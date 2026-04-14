import uuid

from django.conf import settings
from django.db import models


class StudyMaterialFileType(models.TextChoices):
    PDF = "pdf", "PDF"
    DOC = "doc", "DOC"
    DOCX = "docx", "DOCX"
    TXT = "txt", "TXT"


class StudyMaterialStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"


class StudyMaterial(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    file = models.FileField(upload_to="materials/", null=True, blank=True)
    file_type = models.CharField(max_length=10, choices=StudyMaterialFileType.choices, default=StudyMaterialFileType.TXT)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="study_materials",
    )
    status = models.CharField(max_length=20, choices=StudyMaterialStatus.choices, default=StudyMaterialStatus.DRAFT)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class StudyMaterialBookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="material_bookmarks",
    )
    material = models.ForeignKey(
        StudyMaterial,
        on_delete=models.CASCADE,
        related_name="bookmarks",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "material"], name="unique_material_bookmark"),
        ]

    def __str__(self) -> str:
        return f"{self.user_id}:{self.material_id}"
