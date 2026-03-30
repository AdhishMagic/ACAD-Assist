from django.contrib import admin
from django.http import JsonResponse
from django.urls import path


def healthcheck(_request):
    return JsonResponse({"status": "ok"})


def root(_request):
    return JsonResponse({"service": "ACAD Assist Backend", "status": "ok"})


urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("health/", healthcheck),
]
