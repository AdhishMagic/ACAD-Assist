from django.conf import settings
from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=30, unique=True)

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class Material(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="materials/")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="materials")
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="uploaded_materials",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title
