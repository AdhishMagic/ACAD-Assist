from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.notifications.middleware import get_next_page_number
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer


class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class NotificationListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        unread_count = queryset.filter(status="unread").count()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(
                {
                    "data": serializer.data,
                    "unreadCount": unread_count,
                }
            )

        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "data": serializer.data,
                "unreadCount": unread_count,
                "nextPage": None,
                "count": len(serializer.data),
            },
            status=status.HTTP_200_OK,
        )

    def get_paginated_response(self, data):
        next_link = self.paginator.get_next_link()
        payload = {
            **data,
            "count": self.paginator.page.paginator.count,
            "nextPage": get_next_page_number(next_link),
        }
        return Response(payload)


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        notification = (
            Notification.objects.filter(pk=pk, user=request.user).first()
        )
        if not notification:
            return Response({"detail": "Notification not found."}, status=status.HTTP_404_NOT_FOUND)

        notification.status = "read"
        notification.read_at = timezone.now()
        notification.save(update_fields=["status", "read_at", "updated_at"])
        return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        now = timezone.now()
        Notification.objects.filter(user=request.user, status="unread").update(
            status="read", read_at=now, updated_at=now
        )
        return Response({"detail": "All notifications marked as read."}, status=status.HTTP_200_OK)

