from rest_framework.permissions import BasePermission

from accounts.models import UserRole


def normalize_role_value(role):
    value = str(role or "").strip().lower()
    if value == "faculty":
        return "teacher"
    return value


def has_teacher_access(role):
    normalized_role = normalize_role_value(role)
    return normalized_role in {"teacher", "hod"}


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = normalize_role_value(getattr(request.user, "role", ""))
        return role == "student" or role == str(UserRole.STUDENT).strip().lower()


class IsTeacherAccess(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = getattr(request.user, "role", "")
        return has_teacher_access(role)


class IsHOD(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        role = normalize_role_value(getattr(request.user, "role", ""))
        return role == "hod" or role == str(UserRole.HOD).strip().lower()
