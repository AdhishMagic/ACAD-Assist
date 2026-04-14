from rest_framework import status
import logging

from rest_framework.generics import RetrieveAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import File
from .serializers import FileSerializer, FileUploadSerializer

logger = logging.getLogger(__name__)


class FileUploadView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [MultiPartParser, FormParser, JSONParser]

	def post(self, request):
		logger.info(f"[UPLOAD] Request received. User: {request.user.email}")
		logger.info(f"[UPLOAD] Files in request: {list(request.FILES.keys())}")

		serializer = FileUploadSerializer(data=request.data, context={"request": request})
		logger.info("[UPLOAD] Validating upload serializer...")

		serializer.is_valid(raise_exception=True)
		logger.info("[UPLOAD] Validation passed")

		file_instance = serializer.save()
		logger.info(
			f"[UPLOAD] File saved. ID: {file_instance.id}, Name: {file_instance.original_name}, "
			f"Type: {file_instance.file_type}, Editable: {file_instance.is_editable}"
		)

		response_serializer = FileUploadSerializer(file_instance, context={"request": request})
		response_data = response_serializer.data
		logger.info(
			f"[UPLOAD] Response prepared. Extracted content length: {len(response_data.get('extracted_content', ''))}"
		)
		logger.info(f"[UPLOAD] Title suggestion: {response_data.get('title_suggestion', 'N/A')}")

		return Response(response_data, status=status.HTTP_201_CREATED)


class FileDetailView(RetrieveAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = FileSerializer

	def get_queryset(self):
		return File.objects.filter(uploaded_by=self.request.user)

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context