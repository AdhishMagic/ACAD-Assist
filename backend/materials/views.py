from rest_framework import status
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StudyMaterial, StudyMaterialBookmark, StudyMaterialStatus
from .serializers import StudyMaterialSerializer


class StudyMaterialListCreateView(ListCreateAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return StudyMaterial.objects.filter(uploaded_by=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class StudyMaterialLibraryView(ListAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyMaterial.objects.exclude(uploaded_by=self.request.user).select_related("uploaded_by")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class StudyMaterialBookmarksView(ListAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            StudyMaterial.objects.filter(bookmarks__user=self.request.user)
            .select_related("uploaded_by")
            .distinct()
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class StudyMaterialBookmarkToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        material = StudyMaterial.objects.exclude(uploaded_by=request.user).filter(pk=pk).first()
        if not material:
            return Response({"detail": "Material not found."}, status=status.HTTP_404_NOT_FOUND)

        bookmark, created = StudyMaterialBookmark.objects.get_or_create(user=request.user, material=material)
        if not created:
            return Response({"detail": "Already bookmarked."}, status=status.HTTP_200_OK)

        return Response({"detail": "Bookmarked."}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        bookmark = (
            StudyMaterialBookmark.objects.filter(user=request.user, material_id=pk)
            .select_related("material")
            .first()
        )
        if not bookmark:
            return Response({"detail": "Bookmark not found."}, status=status.HTTP_404_NOT_FOUND)

        bookmark.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudyMaterialDetailView(RetrieveUpdateAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return StudyMaterial.objects.filter(uploaded_by=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class StudyMaterialPublishView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        material = StudyMaterial.objects.filter(pk=pk, uploaded_by=request.user).first()
        if not material:
            return Response({"detail": "Material not found."}, status=status.HTTP_404_NOT_FOUND)

        material.status = StudyMaterialStatus.PUBLISHED
        material.is_public = True
        material.save(update_fields=["status", "is_public", "updated_at"])

        serializer = StudyMaterialSerializer(material, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class StudyMaterialPublicListView(ListAPIView):
    serializer_class = StudyMaterialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            StudyMaterial.objects.filter(status=StudyMaterialStatus.PUBLISHED, is_public=True)
            .select_related("uploaded_by")
            .order_by("-updated_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
