from django.urls import path

from .views import (
    AdminUserActivityView,
    AdminUserDeleteView,
    AdminUserResetPasswordView,
    AdminUserRoleUpdateView,
    AdminUserStatusUpdateView,
    AdminUsersView,
)


urlpatterns = [
    path("users/", AdminUsersView.as_view(), name="admin-users"),
    path("users/<int:user_id>/activity/", AdminUserActivityView.as_view(), name="admin-user-activity"),
    path("users/<int:user_id>/role/", AdminUserRoleUpdateView.as_view(), name="admin-user-role"),
    path("users/<int:user_id>/status/", AdminUserStatusUpdateView.as_view(), name="admin-user-status"),
    path("users/<int:user_id>/reset-password/", AdminUserResetPasswordView.as_view(), name="admin-user-reset-password"),
    path("users/<int:user_id>/", AdminUserDeleteView.as_view(), name="admin-user-delete"),
]
