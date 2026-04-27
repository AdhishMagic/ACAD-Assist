import secrets

from django.contrib.auth.models import update_last_login
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView

from .models import User, UserRole
from .serializers import LoginSerializer, RegisterSerializer, RoleRequestSerializer, UserSerializer
from .services import authenticate_user, generate_tokens_for_user
from apps.analytics.utils import record_activity


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        except ValidationError as exc:
            # Treat duplicate-email registration as an idempotent sign-up when
            # the submitted password matches the existing account.
            email_errors = exc.detail.get("email") if isinstance(exc.detail, dict) else None
            duplicate_email = bool(email_errors) and any(
                "already exists" in str(error).lower() for error in email_errors
            )

            submitted_email = request.data.get("email")
            submitted_password = request.data.get("password")

            if duplicate_email and submitted_email and submitted_password:
                user = authenticate_user(email=submitted_email.lower(), password=submitted_password)
                tokens = generate_tokens_for_user(user)
                return Response(
                    {
                        "user": UserSerializer(user).data,
                        "tokens": tokens,
                        "already_registered": True,
                    },
                    status=status.HTTP_200_OK,
                )

            raise

        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        update_last_login(None, user)
        record_activity(
            user=user,
            action="login",
            entity_type="auth",
            entity_id=user.id,
            status="success",
        )
        tokens = generate_tokens_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]
    authentication_classes = []


class RoleRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RoleRequestSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        role_request = serializer.save()
        return Response(RoleRequestSerializer(role_request).data, status=status.HTTP_201_CREATED)


def _format_date(value):
    if not value:
        return "Never"
    return value.strftime("%b %d, %Y")


def _display_role(user: User) -> str:
    role = (user.role or "").strip().lower()
    if user.is_staff or user.is_superuser or role == "admin":
        return "Admin"
    if role in {str(UserRole.FACULTY).lower(), "faculty", "teacher"}:
        return "Teacher"
    if role == str(UserRole.HOD).lower():
        return "HOD"
    return "Student"


def _serialize_user_management_item(user: User) -> dict:
    full_name = f"{(user.first_name or '').strip()} {(user.last_name or '').strip()}".strip()
    return {
        "id": str(user.id),
        "name": full_name or user.email,
        "email": user.email,
        "role": _display_role(user),
        "status": "Active" if user.is_active else "Suspended",
        "joinDate": _format_date(user.date_joined),
        "lastLogin": _format_date(user.last_login),
    }


def _normalize_role(role: str) -> tuple[str, bool, bool]:
    normalized = (role or "").strip().lower()
    if normalized == "student":
        return UserRole.STUDENT, False, False
    if normalized in {"teacher", "faculty"}:
        return UserRole.FACULTY, False, False
    if normalized == "hod":
        return UserRole.HOD, False, False
    if normalized == "admin":
        return UserRole.FACULTY, True, True
    raise ValidationError({"role": "Invalid role. Allowed roles: Student, Teacher, HOD, Admin."})


def _ensure_admin(user: User) -> None:
    if not (user.is_staff or user.is_superuser or (user.role or "").strip().lower() == "admin"):
        raise ValidationError({"detail": "Admin privileges are required for user management."})


class AdminUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        _ensure_admin(request.user)
        users = User.objects.order_by("-date_joined")
        return Response([_serialize_user_management_item(user) for user in users], status=status.HTTP_200_OK)

    def post(self, request):
        _ensure_admin(request.user)
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password") or secrets.token_urlsafe(12)
        first_name = (request.data.get("first_name") or "").strip()
        last_name = (request.data.get("last_name") or "").strip()
        role_input = request.data.get("role") or "Student"

        if not email:
            raise ValidationError({"email": "Email is required."})
        if len(password) < 8:
            raise ValidationError({"password": "Password must be at least 8 characters long."})
        if User.objects.filter(email__iexact=email).exists():
            raise ValidationError({"email": "A user with this email already exists."})

        role_value, is_staff, is_superuser = _normalize_role(role_input)
        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=True,
            is_staff=is_staff,
            is_superuser=is_superuser,
        )
        user.role = role_value
        user.save(update_fields=["role"])

        response_payload = _serialize_user_management_item(user)
        response_payload["generatedPassword"] = password
        record_activity(
            user=request.user,
            action="user_created",
            entity_type="user",
            entity_id=user.id,
            status="success",
            metadata={"targetEmail": user.email, "targetRole": user.role},
        )
        return Response(response_payload, status=status.HTTP_201_CREATED)


def _to_iso(value):
    if not value:
        return None
    return value.isoformat()


def _append_user_activity(activities, *, timestamp, action, entity_type, entity_id, description, metadata=None):
    if not timestamp:
        return
    activities.append(
        {
            "timestamp": _to_iso(timestamp),
            "action": action,
            "entityType": entity_type,
            "entityId": str(entity_id) if entity_id else None,
            "description": description,
            "metadata": metadata or {},
        }
    )


def _build_user_activity_timeline(user: User, limit: int):
    from apps.analytics.models import AIUsageLog, ActivityLog
    from apps.exams.models import Submission
    from apps.files.models import File
    from apps.notes.models import Note
    from apps.notifications.models import Notification
    from apps.queries.models import Query
    from materials.models import StudyMaterial, StudyMaterialBookmark
    from projects.models import Project

    activities = []

    def collect_source(source_name, queryset, build_item):
        try:
            for item in queryset:
                build_item(item)
        except Exception as exc:
            # Keep the timeline usable even if one source table is unavailable.
            # This avoids failing the whole user activity view for a single bad source.
            print(f"Skipping user activity source {source_name}: {exc}")

    _append_user_activity(
        activities,
        timestamp=user.date_joined,
        action="account_created",
        entity_type="user",
        entity_id=user.id,
        description="Account created",
        metadata={"email": user.email},
    )

    if user.last_login:
        _append_user_activity(
            activities,
            timestamp=user.last_login,
            action="login",
            entity_type="auth",
            entity_id=user.id,
            description="Logged in",
        )

    collect_source(
        "files",
        File.objects.filter(uploaded_by=user).order_by("-created_at")[:limit],
        lambda file_obj: _append_user_activity(
            activities,
            timestamp=file_obj.created_at,
            action="file_uploaded",
            entity_type="file",
            entity_id=file_obj.id,
            description=file_obj.original_name or "Uploaded a file",
            metadata={
                "fileType": file_obj.file_type,
                "sizeBytes": file_obj.size_bytes,
                "isEditable": file_obj.is_editable,
            },
        ),
    )

    collect_source(
        "notes",
        Note.objects.filter(created_by=user).order_by("-created_at")[:limit],
        lambda note: _append_user_activity(
            activities,
            timestamp=note.created_at,
            action="note_created",
            entity_type="note",
            entity_id=note.id,
            description=note.title or "Created a note",
            metadata={
                "noteType": note.note_type,
                "isPublished": note.is_published,
                "source": note.source,
                "aiModel": note.ai_model,
            },
        ),
    )

    collect_source(
        "queries",
        Query.objects.filter(user=user).order_by("-created_at")[:limit],
        lambda query: _append_user_activity(
            activities,
            timestamp=query.created_at,
            action="query_created",
            entity_type="query",
            entity_id=query.id,
            description=(query.prompt or "").strip()[:140] or "Created a query",
            metadata={"status": query.status},
        ),
    )

    collect_source(
        "student_projects",
        Project.objects.filter(student=user).order_by("-created_at")[:limit],
        lambda project: _append_user_activity(
            activities,
            timestamp=project.created_at,
            action="project_submitted",
            entity_type="project",
            entity_id=project.id,
            description=project.title or "Submitted a project",
            metadata={"status": project.status},
        ),
    )

    collect_source(
        "reviewed_projects",
        Project.objects.filter(reviewed_by=user).order_by("-reviewed_at", "-created_at")[:limit],
        lambda reviewed_project: _append_user_activity(
            activities,
            timestamp=reviewed_project.reviewed_at or reviewed_project.created_at,
            action="project_reviewed",
            entity_type="project",
            entity_id=reviewed_project.id,
            description=reviewed_project.title or "Reviewed a project",
            metadata={"status": reviewed_project.status},
        ),
    )

    collect_source(
        "study_materials",
        StudyMaterial.objects.filter(uploaded_by=user).order_by("-created_at")[:limit],
        lambda material: _append_user_activity(
            activities,
            timestamp=material.created_at,
            action="material_uploaded",
            entity_type="material",
            entity_id=material.id,
            description=material.title or "Uploaded study material",
            metadata={"status": material.status, "isPublic": material.is_public},
        ),
    )

    collect_source(
        "bookmarks",
        StudyMaterialBookmark.objects.filter(user=user).select_related("material").order_by("-created_at")[:limit],
        lambda bookmark: _append_user_activity(
            activities,
            timestamp=bookmark.created_at,
            action="material_bookmarked",
            entity_type="material_bookmark",
            entity_id=bookmark.material_id,
            description=f"Bookmarked: {bookmark.material.title}",
        ),
    )

    collect_source(
        "submissions",
        Submission.objects.filter(user=user).select_related("exam").order_by("-created_at")[:limit],
        lambda submission: _append_user_activity(
            activities,
            timestamp=submission.created_at,
            action="exam_submission",
            entity_type="submission",
            entity_id=submission.id,
            description=f"Exam: {submission.exam.title}",
            metadata={"status": submission.status, "score": str(submission.score) if submission.score is not None else None},
        ),
    )

    collect_source(
        "notifications",
        Notification.objects.filter(user=user).order_by("-created_at")[:limit],
        lambda notification: _append_user_activity(
            activities,
            timestamp=notification.created_at,
            action="notification_received",
            entity_type="notification",
            entity_id=notification.id,
            description=notification.title,
            metadata={"status": notification.status, "type": notification.notification_type},
        ),
    )

    collect_source(
        "activity_logs",
        ActivityLog.objects.filter(user=user).order_by("-created_at")[:limit],
        lambda audit_log: _append_user_activity(
            activities,
            timestamp=audit_log.created_at,
            action=audit_log.action or "activity",
            entity_type=audit_log.entity_type or "activity_log",
            entity_id=audit_log.entity_id,
            description=audit_log.action or "Activity logged",
            metadata=audit_log.metadata,
        ),
    )

    collect_source(
        "ai_usage",
        AIUsageLog.objects.filter(user=user).order_by("-created_at")[:limit],
        lambda usage: _append_user_activity(
            activities,
            timestamp=usage.created_at,
            action="ai_usage",
            entity_type="ai_usage",
            entity_id=usage.id,
            description=f"Used {usage.feature_name}",
            metadata={
                "model": usage.model_name,
                "inputTokens": usage.input_tokens,
                "outputTokens": usage.output_tokens,
                "latencyMs": usage.latency_ms,
                "costUsd": str(usage.cost_usd),
            },
        ),
    )

    activities.sort(key=lambda item: item["timestamp"] or "", reverse=True)
    return activities[:limit]


class AdminUserActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        _ensure_admin(request.user)
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            limit = int(request.query_params.get("limit", 500))
        except (TypeError, ValueError):
            limit = 500
        limit = max(1, min(limit, 1000))

        activity_items = _build_user_activity_timeline(target_user, limit)
        return Response(
            {
                "user": _serialize_user_management_item(target_user),
                "total": len(activity_items),
                "activities": activity_items,
            },
            status=status.HTTP_200_OK,
        )


class AdminUserRoleUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        _ensure_admin(request.user)
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            record_activity(
                user=request.user,
                action="user_role_update",
                entity_type="user",
                entity_id=user_id,
                status="error",
                metadata={"error": "User not found."},
            )
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        role_input = request.data.get("role")
        role_value, is_staff, is_superuser = _normalize_role(role_input)

        target_user.role = role_value
        target_user.is_staff = is_staff
        target_user.is_superuser = is_superuser
        target_user.save(update_fields=["role", "is_staff", "is_superuser"])
        record_activity(
            user=request.user,
            action="user_role_updated",
            entity_type="user",
            entity_id=target_user.id,
            status="success",
            metadata={"targetEmail": target_user.email, "role": role_value},
        )

        return Response(_serialize_user_management_item(target_user), status=status.HTTP_200_OK)


class AdminUserStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        _ensure_admin(request.user)
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            record_activity(
                user=request.user,
                action="user_status_update",
                entity_type="user",
                entity_id=user_id,
                status="error",
                metadata={"error": "User not found."},
            )
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        status_value = (request.data.get("status") or "").strip().lower()
        if status_value not in {"active", "suspended"}:
            record_activity(
                user=request.user,
                action="user_status_update",
                entity_type="user",
                entity_id=target_user.id,
                status="warning",
                metadata={"error": "Invalid status value.", "submittedStatus": status_value},
            )
            raise ValidationError({"status": "Invalid status. Allowed values: Active, Suspended."})

        target_user.is_active = status_value == "active"
        target_user.save(update_fields=["is_active"])
        record_activity(
            user=request.user,
            action="user_status_updated",
            entity_type="user",
            entity_id=target_user.id,
            status="success",
            metadata={"targetEmail": target_user.email, "status": status_value},
        )
        return Response(_serialize_user_management_item(target_user), status=status.HTTP_200_OK)


class AdminUserResetPasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        _ensure_admin(request.user)
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            record_activity(
                user=request.user,
                action="user_password_reset",
                entity_type="user",
                entity_id=user_id,
                status="error",
                metadata={"error": "User not found."},
            )
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        new_password = request.data.get("new_password") or secrets.token_urlsafe(12)
        if len(new_password) < 8:
            record_activity(
                user=request.user,
                action="user_password_reset",
                entity_type="user",
                entity_id=target_user.id,
                status="warning",
                metadata={"error": "Password must be at least 8 characters long."},
            )
            raise ValidationError({"new_password": "Password must be at least 8 characters long."})
        target_user.set_password(new_password)
        target_user.save(update_fields=["password"])
        record_activity(
            user=request.user,
            action="user_password_reset",
            entity_type="user",
            entity_id=target_user.id,
            status="success",
            metadata={"targetEmail": target_user.email},
        )

        return Response(
            {
                "message": "Password reset successfully.",
                "temporaryPassword": new_password,
            },
            status=status.HTTP_200_OK,
        )


class AdminUserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        _ensure_admin(request.user)
        target_user = User.objects.filter(id=user_id).first()
        if not target_user:
            record_activity(
                user=request.user,
                action="user_deleted",
                entity_type="user",
                entity_id=user_id,
                status="error",
                metadata={"error": "User not found."},
            )
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target_user.id == request.user.id:
            record_activity(
                user=request.user,
                action="user_deleted",
                entity_type="user",
                entity_id=target_user.id,
                status="warning",
                metadata={"error": "Attempted self-delete."},
            )
            raise ValidationError({"detail": "You cannot delete your own account."})

        deleted_email = target_user.email
        target_user.delete()
        record_activity(
            user=request.user,
            action="user_deleted",
            entity_type="user",
            entity_id=user_id,
            status="success",
            metadata={"targetEmail": deleted_email},
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
