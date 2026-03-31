from django.conf import settings
from django.db import models

from apps.academics.models import Subject
from db_design.base import AuditModel
from db_design.constants import NoteSource


class Note(AuditModel):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
	subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name="notes")
	title = models.CharField(max_length=255)
	body = models.TextField()
	source = models.CharField(max_length=20, choices=NoteSource.choices, default=NoteSource.MANUAL, db_index=True)
	ai_model = models.CharField(max_length=100, blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["user"], name="idx_note_user"),
		]
		verbose_name = "Note"
		verbose_name_plural = "Notes"

	def __str__(self):
		return self.title
