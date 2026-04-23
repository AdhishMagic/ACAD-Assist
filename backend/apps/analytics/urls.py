from django.urls import path

from .views import (
    AdminActivityLogsView,
    AdminAIUsageStatsView,
    AdminDashboardView,
    AdminStorageFileDeleteView,
    AdminStorageFilesView,
    AdminStorageStatsView,
    AdminSystemAnalyticsView,
    TeacherClassesView,
    TeacherDashboardView,
    TeacherStudentActivityView,
)


urlpatterns = [
    path("teacher/dashboard/", TeacherDashboardView.as_view(), name="teacher-dashboard"),
    path("teacher/classes/", TeacherClassesView.as_view(), name="teacher-classes"),
    path("teacher/activity/", TeacherStudentActivityView.as_view(), name="teacher-student-activity"),
    path("dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("analytics/", AdminSystemAnalyticsView.as_view(), name="admin-system-analytics"),
    path("activity-logs/", AdminActivityLogsView.as_view(), name="admin-activity-logs"),
    path("storage/stats/", AdminStorageStatsView.as_view(), name="admin-storage-stats"),
    path("storage/files/", AdminStorageFilesView.as_view(), name="admin-storage-files"),
    path("storage/files/<str:file_id>/", AdminStorageFileDeleteView.as_view(), name="admin-storage-file-delete"),
    path("ai-usage/", AdminAIUsageStatsView.as_view(), name="admin-ai-usage-stats"),
]
