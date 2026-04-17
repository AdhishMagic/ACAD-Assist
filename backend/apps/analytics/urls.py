from django.urls import path

from .views import AdminDashboardView, AdminSystemAnalyticsView


urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("analytics/", AdminSystemAnalyticsView.as_view(), name="admin-system-analytics"),
]
