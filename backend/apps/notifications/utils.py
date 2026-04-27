from django.utils import timezone

from apps.notifications.models import Notification
from db_design.constants import NotificationType


def create_notification(
    *,
    user,
    title,
    message,
    notification_type=NotificationType.INFO,
    metadata=None,
    created_by=None,
):
    """Helper to create a Notification record for a user."""
    if not user or getattr(user, "is_anonymous", False):
        return None
    return Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notification_type,
        metadata=metadata or {},
        created_by=created_by or user,
        updated_by=created_by or user,
    )

