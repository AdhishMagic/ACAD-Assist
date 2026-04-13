import logging

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, ProjectStatus
from .permissions import IsHOD, IsStudent
from .serializers import ProjectSerializer, ProjectSubmitSerializer


logger = logging.getLogger("projects")


class ProjectSubmitView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        logger.info("Project submit request received", extra={"user_id": request.user.id})
        serializer = ProjectSubmitSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        project = serializer.save()
        return Response(ProjectSerializer(project, context={"request": request}).data, status=status.HTTP_201_CREATED)


class MyProjectsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        logger.info("My projects fetch request received", extra={"user_id": request.user.id})
        projects = Project.objects.filter(student=request.user).select_related("student", "reviewed_by")
        return Response(ProjectSerializer(projects, many=True, context={"request": request}).data, status=status.HTTP_200_OK)


class AllProjectsView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]

    def get(self, request):
        logger.info("All projects fetch request received", extra={"user_id": request.user.id})
        projects = Project.objects.select_related("student", "reviewed_by").all()
        return Response(ProjectSerializer(projects, many=True, context={"request": request}).data, status=status.HTTP_200_OK)


class _ProjectReviewBaseView(APIView):
    permission_classes = [IsAuthenticated, IsHOD]
    target_status = None

    def patch(self, request, pk):
        logger.info("Project review action request received", extra={"user_id": request.user.id, "project_id": pk, "target_status": self.target_status})
        project = Project.objects.filter(pk=pk).first()
        if not project:
            return Response({"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND)

        project.status = self.target_status
        project.reviewed_by = request.user
        project.reviewed_at = timezone.now()
        project.save(update_fields=["status", "reviewed_by", "reviewed_at"])

        return Response(ProjectSerializer(project, context={"request": request}).data, status=status.HTTP_200_OK)


class ApproveProjectView(_ProjectReviewBaseView):
    target_status = ProjectStatus.APPROVED


class RejectProjectView(_ProjectReviewBaseView):
    target_status = ProjectStatus.REJECTED
