from django.conf import settings
from django.db import models

from db_design.base import AuditModel


class Note(AuditModel):
	file = models.ForeignKey(
		"files.File",
		on_delete=models.CASCADE,
		related_name="notes",
		null=True,
		blank=True,
	)
	title = models.CharField(max_length=255)
	content = models.TextField()
	note_type = models.CharField(max_length=50, default="Lecture")
	tags = models.JSONField(default=list, blank=True)
	is_published = models.BooleanField(default=False, db_index=True)
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="saved_notes")
	subject = models.ForeignKey("academics.Subject", on_delete=models.SET_NULL, null=True, blank=True, related_name="notes")
	source = models.CharField(max_length=20, blank=True, default="manual")
	ai_model = models.CharField(max_length=100, blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ["-created_at"]
		indexes = [
			models.Index(fields=["created_by"], name="idx_note_created_by"),
			models.Index(fields=["file"], name="idx_note_file"),
			models.Index(fields=["note_type"], name="idx_note_type"),
			models.Index(fields=["is_published"], name="idx_note_published"),
		]
		verbose_name = "Note"
		verbose_name_plural = "Notes"

	def __str__(self):
		return self.title
