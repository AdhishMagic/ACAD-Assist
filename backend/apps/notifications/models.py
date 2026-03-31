from django.conf import settings
from django.db import models

from db_design.base import AuditModel
from db_design.constants import NotificationStatus, NotificationType


class Notification(AuditModel):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
	title = models.CharField(max_length=255)
	message = models.TextField()
	notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.INFO, db_index=True)
	status = models.CharField(max_length=20, choices=NotificationStatus.choices, default=NotificationStatus.UNREAD, db_index=True)
	read_at = models.DateTimeField(null=True, blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["user", "status"], name="idx_notification_user_status"),
		]
		verbose_name = "Notification"
		verbose_name_plural = "Notifications"

	def __str__(self):
		return self.title
