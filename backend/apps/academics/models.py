from django.db import models

from db_design.base import AuditModel
from db_design.constants import ApprovalStatus


class Subject(AuditModel):
	code = models.CharField(max_length=30, unique=True, db_index=True)
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["code"], name="idx_subject_code"),
		]
		verbose_name = "Subject"
		verbose_name_plural = "Subjects"

	def __str__(self):
		return f"{self.code} - {self.name}"


class Unit(AuditModel):
	subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="units")
	code = models.CharField(max_length=30, blank=True)
	title = models.CharField(max_length=255)
	order_index = models.PositiveIntegerField(default=1, db_index=True)
	description = models.TextField(blank=True)

	class Meta:
		ordering = ["subject__name", "order_index", "title"]
		constraints = [
			models.UniqueConstraint(fields=["subject", "order_index"], name="uniq_unit_subject_order"),
		]
		indexes = [
			models.Index(fields=["subject", "order_index"], name="idx_unit_subject_order"),
			models.Index(fields=["subject", "title"], name="idx_unit_subject_title"),
		]
		verbose_name = "Unit"
		verbose_name_plural = "Units"

	def __str__(self):
		prefix = f"{self.code} - " if self.code else ""
		return f"{prefix}{self.title}"


class Material(AuditModel):
	subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="materials")
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	storage_path = models.CharField(max_length=512)
	status = models.CharField(max_length=20, choices=ApprovalStatus.choices, default=ApprovalStatus.PENDING, db_index=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["subject", "status"], name="idx_material_subject_status"),
		]
		verbose_name = "Material"
		verbose_name_plural = "Materials"

	def __str__(self):
		return self.title
