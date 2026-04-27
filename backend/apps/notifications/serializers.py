from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    read = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            "id",
            "title",
            "message",
            "type",
            "status",
            "read",
            "date",
            "read_at",
            "metadata",
            "created_at",
        )
        read_only_fields = fields

    def get_read(self, obj: Notification) -> bool:
        return obj.status == "read"

    def get_date(self, obj: Notification) -> str:
        return obj.created_at.isoformat()

    def get_type(self, obj: Notification) -> str:
        return obj.notification_type

