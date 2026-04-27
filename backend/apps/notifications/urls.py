from django.urls import path

from apps.notifications.views import (
    MarkAllNotificationsReadView,
    MarkNotificationReadView,
    NotificationListView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<uuid:pk>/read/", MarkNotificationReadView.as_view(), name="notification-mark-read"),
    path("read-all/", MarkAllNotificationsReadView.as_view(), name="notification-mark-all-read"),
]

