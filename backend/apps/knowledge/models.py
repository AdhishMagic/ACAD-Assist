from django.db import models
from django.conf import settings
from apps.courses.models import Course
from shared.constants.enums import DocumentType

class Document(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="knowledge_files/")
    file_type = models.CharField(max_length=20, choices=[(t.value, t.name) for t in DocumentType])
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="documents")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
