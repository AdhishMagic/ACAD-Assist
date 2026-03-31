import uuid

from django.conf import settings
from django.db import models

from db_design.base import AuditModel


class ActivityLog(AuditModel):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	action = models.CharField(max_length=100, db_index=True)
	entity_type = models.CharField(max_length=100, blank=True)
	entity_id = models.UUIDField(null=True, blank=True, default=None)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["action"], name="idx_activity_action"),
			models.Index(fields=["user"], name="idx_activity_user"),
		]
		verbose_name = "Activity Log"
		verbose_name_plural = "Activity Logs"

	def __str__(self):
		return self.action


class AIUsageLog(AuditModel):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	feature_name = models.CharField(max_length=100, db_index=True)
	model_name = models.CharField(max_length=100)
	input_tokens = models.PositiveIntegerField(default=0)
	output_tokens = models.PositiveIntegerField(default=0)
	latency_ms = models.PositiveIntegerField(default=0)
	cost_usd = models.DecimalField(max_digits=10, decimal_places=4, default=0)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["feature_name", "model_name"], name="idx_aiusage_feature_model"),
		]
		verbose_name = "AI Usage Log"
		verbose_name_plural = "AI Usage Logs"

	def __str__(self):
		return f"{self.feature_name}:{self.model_name}"
