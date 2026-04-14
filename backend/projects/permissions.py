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


def can_submit_projects(user):
    if not user or not user.is_authenticated:
        return False

    if user.is_staff or user.is_superuser:
        return True

    role = normalize_role_value(getattr(user, "role", ""))
    return role in {"student", "hod", "admin"}


def can_review_projects(user):
    if not user or not user.is_authenticated:
        return False

    if user.is_staff or user.is_superuser:
        return True

    role = normalize_role_value(getattr(user, "role", ""))
    return role in {"hod", "admin"}


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


class CanSubmitProject(BasePermission):
    def has_permission(self, request, view):
        return can_submit_projects(request.user)


class CanReviewProject(BasePermission):
    def has_permission(self, request, view):
        return can_review_projects(request.user)
