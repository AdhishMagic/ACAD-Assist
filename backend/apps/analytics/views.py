from rest_framework import viewsets, permissions
from .models import StudentProgress
from .serializers import StudentProgressSerializer

class StudentProgressViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_instructor:
            return StudentProgress.objects.filter(course__instructor=user)
        return StudentProgress.objects.filter(student=user)
