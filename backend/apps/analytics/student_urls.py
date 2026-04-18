from django.urls import path

from .views import StudentDashboardView, StudentOverviewView


urlpatterns = [
    path("dashboard/", StudentDashboardView.as_view(), name="student-dashboard"),
    path("overview/", StudentOverviewView.as_view(), name="student-overview"),
]
