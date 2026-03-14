from rest_framework.routers import DefaultRouter
from .views import StudentProgressViewSet

router = DefaultRouter()
router.register(r'progress', StudentProgressViewSet, basename="progress")

urlpatterns = router.urls
