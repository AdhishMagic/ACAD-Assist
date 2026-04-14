from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Note
from .serializers import NoteSaveSerializer, NoteSerializer


class SaveNoteView(APIView):
	permission_classes = [IsAuthenticated]
	parser_classes = [MultiPartParser, FormParser, JSONParser]

	def post(self, request):
		serializer = NoteSaveSerializer(data=request.data, context={"request": request})
		serializer.is_valid(raise_exception=True)
		note = serializer.save()
		response = NoteSerializer(note, context={"request": request}).data
		return Response(response, status=status.HTTP_200_OK if request.data.get("note_id") else status.HTTP_201_CREATED)


class SavedNotesView(ListAPIView):
	permission_classes = [IsAuthenticated]
	serializer_class = NoteSerializer

	def get_queryset(self):
		queryset = Note.objects.filter(created_by=self.request.user).select_related("file", "created_by")
		search = (self.request.query_params.get("search") or self.request.query_params.get("q") or "").strip()
		if search:
			queryset = queryset.filter(
				Q(title__icontains=search)
				| Q(content__icontains=search)
				| Q(file__original_name__icontains=search)
			)
		return queryset

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["request"] = self.request
		return context