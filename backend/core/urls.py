from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


urlpatterns = [
	path("admin/", admin.site.urls),
	path("auth/", include("accounts.urls")),
	path("api/v1/auth/", include("accounts.urls")),
	path("health/", lambda request: JsonResponse({"status": "ok"})),
]
