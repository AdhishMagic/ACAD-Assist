from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import QuestionPaper
from .serializers import QuestionPaperSerializer

class QuestionPaperViewSet(viewsets.ModelViewSet):
    queryset = QuestionPaper.objects.all()
    serializer_class = QuestionPaperSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        # TODO: Call AI service to generate questions based on syllabus/documents
        return Response({"status": "generation_started"}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['get'])
    def export(self, request, pk=None):
        # TODO: Export to PDF/DOCX
        return Response({"status": "exporting"}, status=status.HTTP_200_OK)
