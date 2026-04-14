from django.urls import path

from .views import FileDetailView, FileUploadView


urlpatterns = [
	path("upload/", FileUploadView.as_view(), name="file-upload"),
	path("<uuid:pk>/", FileDetailView.as_view(), name="file-detail"),
]