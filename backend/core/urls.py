from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.urls import include, path


urlpatterns = [
	path("admin/", admin.site.urls),
	path("auth/", include("accounts.urls")),
	path("api/v1/auth/", include("accounts.urls")),
	path("api/materials/", include("materials.urls")),
	path("api/projects/", include("projects.urls")),
	path("health/", lambda request: JsonResponse({"status": "ok"})),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
