from django.conf import settings
from django.db import models

from db_design.base import AuditModel


class File(AuditModel):
	file = models.FileField(upload_to="uploads/%Y/%m/%d/", null=True, blank=True)
	file_type = models.CharField(max_length=20, db_index=True)
	uploaded_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="uploaded_files",
	)
	is_editable = models.BooleanField(default=False, db_index=True)
	original_name = models.CharField(max_length=255)
	storage_path = models.CharField(max_length=512, blank=True)
	checksum = models.CharField(max_length=128, db_index=True)
	mime_type = models.CharField(max_length=150, blank=True)
	size_bytes = models.BigIntegerField(default=0)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ["-created_at"]
		indexes = [
			models.Index(fields=["uploaded_by"], name="idx_file_uploaded_by"),
			models.Index(fields=["file_type"], name="idx_file_type"),
			models.Index(fields=["checksum"], name="idx_file_checksum"),
		]
		verbose_name = "File"
		verbose_name_plural = "Files"

	def __str__(self):
		return self.original_name or str(self.id)
