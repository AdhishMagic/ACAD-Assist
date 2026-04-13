from rest_framework.permissions import BasePermission

from accounts.models import UserRole


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = str(getattr(request.user, "role", "")).strip().lower()
        return role == "student" or role == str(UserRole.STUDENT).strip().lower()


class IsHOD(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = str(getattr(request.user, "role", "")).strip().lower()
        return role == "hod" or role == str(UserRole.HOD).strip().lower()
