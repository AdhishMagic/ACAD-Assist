from django.conf import settings
from django.db import models

from db_design.base import AuditModel


class File(AuditModel):
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="files")
	filename = models.CharField(max_length=255)
	storage_path = models.CharField(max_length=512)
	checksum = models.CharField(max_length=128, unique=True, db_index=True)
	mime_type = models.CharField(max_length=100, blank=True)
	size_bytes = models.BigIntegerField(default=0)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["owner"], name="idx_file_owner"),
			models.Index(fields=["checksum"], name="idx_file_checksum"),
		]
		verbose_name = "File"
		verbose_name_plural = "Files"

	def __str__(self):
		return self.filename
