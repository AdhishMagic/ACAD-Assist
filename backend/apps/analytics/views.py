from datetime import timedelta
from decimal import Decimal
from pathlib import Path

from django.db.models import Avg, Count, Max, Min, Q, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User, UserRole
from apps.analytics.models import AIUsageLog, ActivityLog
from apps.exams.models import Exam, Submission
from apps.files.models import File
from apps.notes.models import Note
from apps.queries.models import Query, Response as QueryResponseModel
from materials.models import StudyMaterial
from projects.models import Project
from db_design.constants import SubmissionStatus


def _format_storage_size(size_bytes: int) -> str:
    if size_bytes <= 0:
        return "0 B"

    units = ["B", "KB", "MB", "GB", "TB"]
    value = float(size_bytes)
    for unit in units:
        if value < 1024 or unit == units[-1]:
            if unit == "B":
                return f"{int(value)} {unit}"
            return f"{value:.1f} {unit}"
        value /= 1024

    return "0 B"


def _safe_positive_int(value, default=0):
    try:
        return max(0, int(value or default))
    except (TypeError, ValueError):
        return default


def _estimated_tokens(text):
    if not text:
        return 0
    return max(1, round(len(str(text).split()) * 1.3))


def _query_response_token_count(response_obj, token_key, fallback_text):
    usage = response_obj.token_usage or {}
    if not isinstance(usage, dict):
        usage = {}
    return _safe_positive_int(
        usage.get(token_key)
        or usage.get(token_key.replace("_", ""))
        or usage.get(token_key.replace("_tokens", "Tokens")),
        _estimated_tokens(fallback_text),
    )


def _time_ago(timestamp):
    if not timestamp:
        return "just now"

    now = timezone.now()
    delta = now - timestamp
    seconds = int(delta.total_seconds())

    if seconds < 60:
        return "just now"
    if seconds < 3600:
        minutes = seconds // 60
        return f"{minutes}m ago"
    if seconds < 86400:
        hours = seconds // 3600
        return f"{hours}h ago"

    days = seconds // 86400
    return f"{days}d ago"


def _ensure_admin(user):
    if not (user.is_staff or user.is_superuser or (user.role or "").strip().lower() == "admin"):
        return False
    return True


def _role_filter(*roles):
    values = set()
    for role in roles:
        if not role:
            continue
        role_value = str(role)
        values.add(role_value)
        values.add(role_value.lower())
        if role_value == UserRole.FACULTY:
            values.add("teacher")

    return Q(role__in=values)


def _display_user_name(user):
    if not user:
        return "System"

    full_name = f"{(user.first_name or '').strip()} {(user.last_name or '').strip()}".strip()
    return full_name or user.email


def _format_date_short(value):
    if not value:
        return "-"
    return timezone.localtime(value).strftime("%b %d, %Y")


def _file_field_size(file_field):
    if not file_field:
        return 0
    try:
        return int(file_field.size or 0)
    except (OSError, ValueError):
        return 0


def _file_field_url(file_field, request=None):
    if not file_field:
        return None
    try:
        url = file_field.url
    except ValueError:
        return None
    return request.build_absolute_uri(url) if request else url


def _storage_type(filename, fallback="Other"):
    suffix = Path(filename or "").suffix.lower().lstrip(".")
    return (suffix or fallback or "Other").lower()


def _infer_module(action, entity_type):
    text = f"{(action or '')} {(entity_type or '')}".lower()

    if any(token in text for token in ["login", "logout", "auth", "password", "token"]):
        return "Authentication"
    if any(token in text for token in ["note", "query", "knowledge", "material", "project"]):
        return "Knowledge Repo"
    if any(token in text for token in ["ai", "llm", "model", "prompt"]):
        return "AI Assistant"
    if any(token in text for token in ["user", "role", "admin"]):
        return "User Management"

    return "User Management"


def _infer_status(metadata):
    if not isinstance(metadata, dict):
        return "Success"

    status_value = str(metadata.get("status", "")).strip().lower()
    if status_value in {"failed", "failure", "error"}:
        return "Failed"
    if status_value in {"warning", "warn"}:
        return "Warning"

    if metadata.get("error"):
        return "Failed"

    return "Success"


def _extract_study_minutes(metadata):
    if not isinstance(metadata, dict):
        return 0

    minutes_raw = metadata.get("study_minutes") or metadata.get("minutes") or metadata.get("duration_minutes")
    if minutes_raw is not None:
        try:
            return max(int(float(minutes_raw)), 0)
        except (TypeError, ValueError):
            return 0

    hours_raw = metadata.get("study_hours") or metadata.get("hours") or metadata.get("duration_hours")
    if hours_raw is not None:
        try:
            return max(int(float(hours_raw) * 60), 0)
        except (TypeError, ValueError):
            return 0

    return 0


def _format_hours_label(hours_value):
    if hours_value <= 0:
        return "0h"
    if float(hours_value).is_integer():
        return f"{int(hours_value)}h"
    return f"{hours_value:.1f}h"


def _metadata_number(metadata, *keys):
    if not isinstance(metadata, dict):
        return None

    for key in keys:
        value = metadata.get(key)
        if value is None:
            continue
        try:
            return float(value)
        except (TypeError, ValueError):
            continue

    return None


def _format_duration(seconds):
    total_seconds = max(int(seconds or 0), 0)
    minutes, remaining_seconds = divmod(total_seconds, 60)
    return f"{minutes}m {remaining_seconds:02d}s"


def _distinct_user_count(*querysets):
    user_ids = set()
    for queryset in querysets:
        user_ids.update(value for value in queryset if value)
    return len(user_ids)


def _storage_file_records(request=None):
    records = []

    for file_obj in File.objects.select_related("uploaded_by").order_by("-created_at"):
        records.append(
            {
                "id": f"file:{file_obj.id}",
                "source": "file",
                "raw_id": file_obj.id,
                "name": file_obj.original_name or Path(file_obj.storage_path or "").name or str(file_obj.id),
                "type": (file_obj.file_type or _storage_type(file_obj.original_name)).lower(),
                "sizeBytes": int(file_obj.size_bytes or 0),
                "uploadedBy": _display_user_name(file_obj.uploaded_by),
                "uploadedById": file_obj.uploaded_by_id,
                "createdAt": file_obj.created_at,
                "url": _file_field_url(file_obj.file, request),
            }
        )

    for material in StudyMaterial.objects.select_related("uploaded_by").exclude(file="").order_by("-created_at"):
        if not material.file:
            continue
        filename = Path(material.file.name or "").name
        records.append(
            {
                "id": f"material:{material.id}",
                "source": "material",
                "raw_id": material.id,
                "name": filename or material.title,
                "type": (material.file_type or _storage_type(filename)).lower(),
                "sizeBytes": _file_field_size(material.file),
                "uploadedBy": _display_user_name(material.uploaded_by),
                "uploadedById": material.uploaded_by_id,
                "createdAt": material.created_at,
                "url": _file_field_url(material.file, request),
            }
        )

    for project in Project.objects.select_related("student").exclude(file="").order_by("-created_at"):
        if not project.file:
            continue
        filename = Path(project.file.name or "").name
        records.append(
            {
                "id": f"project:{project.id}",
                "source": "project",
                "raw_id": project.id,
                "name": filename or project.title,
                "type": _storage_type(filename),
                "sizeBytes": _file_field_size(project.file),
                "uploadedBy": _display_user_name(project.student),
                "uploadedById": project.student_id,
                "createdAt": project.created_at,
                "url": _file_field_url(project.file, request),
            }
        )

    records.sort(key=lambda item: item["createdAt"], reverse=True)
    return records


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        week_start = now.date() - timedelta(days=6)

        notes_qs = Note.objects.filter(created_by=user).select_related("subject")
        notes_count = notes_qs.count()
        notes_this_week = notes_qs.filter(created_at__date__gte=week_start).count()

        completed_submissions = Submission.objects.filter(
            user=user,
            status__in=[SubmissionStatus.SUBMITTED, SubmissionStatus.EVALUATED],
        ).select_related("exam", "exam__subject")
        tests_completed = completed_submissions.count()
        average_score = completed_submissions.exclude(score__isnull=True).aggregate(avg=Avg("score"))["avg"]

        note_subject_ids = set(
            notes_qs.exclude(subject_id__isnull=True).values_list("subject_id", flat=True)
        )
        submission_subject_ids = set(
            completed_submissions.exclude(exam__subject_id__isnull=True).values_list("exam__subject_id", flat=True)
        )
        subject_ids = note_subject_ids | submission_subject_ids
        courses_enrolled = len(subject_ids)

        upcoming_exams_qs = Exam.objects.filter(
            scheduled_at__isnull=False,
            scheduled_at__gte=now,
        ).select_related("subject")
        if subject_ids:
            upcoming_exams_qs = upcoming_exams_qs.filter(subject_id__in=subject_ids)

        upcoming_exams = list(upcoming_exams_qs.order_by("scheduled_at")[:5])
        if not upcoming_exams:
            upcoming_exams = list(Exam.objects.filter(
                scheduled_at__isnull=False,
                scheduled_at__gte=now,
            ).select_related("subject").order_by("scheduled_at")[:5])

        activity_logs_qs = ActivityLog.objects.filter(user=user).order_by("-created_at")
        total_study_minutes = 0
        week_study_minutes = 0
        for log in activity_logs_qs[:400]:
            minutes = _extract_study_minutes(log.metadata)
            total_study_minutes += minutes
            if log.created_at.date() >= week_start:
                week_study_minutes += minutes

        study_hours_total = round(total_study_minutes / 60, 1)
        study_hours_week = round(week_study_minutes / 60, 1)

        student_name = _display_user_name(user)
        tests_trend = (
            f"{round(float(average_score), 1)}% average score"
            if average_score is not None
            else "No graded tests yet"
        )

        recent_notes = [
            {
                "id": str(note.id),
                "title": note.title,
                "subject": getattr(note.subject, "name", None) or "General",
                "lastOpened": _time_ago(note.updated_at or note.created_at),
            }
            for note in notes_qs.order_by("-updated_at")[:5]
        ]

        upcoming_tests = [
            {
                "id": str(exam.id),
                "name": exam.title,
                "subject": getattr(exam.subject, "name", None) or "General",
                "date": timezone.localtime(exam.scheduled_at).strftime("%b %d, %Y"),
                "duration": f"{exam.duration_minutes} mins",
            }
            for exam in upcoming_exams
        ]

        recent_activity = []
        for log in activity_logs_qs[:5]:
            text = f"{(log.action or '').strip()} {(log.entity_type or '').strip()}".strip().lower()
            if "test" in text or "exam" in text or "submission" in text:
                item_type = "test"
            elif "ai" in text or "assistant" in text or "prompt" in text:
                item_type = "ai"
            elif "note" in text:
                item_type = "note"
            else:
                item_type = "activity"

            title = (log.action or "Activity").strip()
            if log.entity_type:
                title = f"{title} {log.entity_type}".strip()

            recent_activity.append(
                {
                    "id": str(log.id),
                    "type": item_type,
                    "title": title,
                    "time": _time_ago(log.created_at),
                }
            )

        if not recent_activity:
            fallback_events = []
            for note in notes_qs.order_by("-created_at")[:3]:
                fallback_events.append(
                    {
                        "id": f"note-{note.id}",
                        "type": "note",
                        "title": f'Created "{note.title}"',
                        "time": _time_ago(note.created_at),
                        "sort_time": note.created_at,
                    }
                )

            for submission in completed_submissions.order_by("-created_at")[:3]:
                fallback_events.append(
                    {
                        "id": f"submission-{submission.id}",
                        "type": "test",
                        "title": f'Completed "{submission.exam.title}"',
                        "time": _time_ago(submission.created_at),
                        "sort_time": submission.created_at,
                    }
                )

            for usage_log in AIUsageLog.objects.filter(user=user).order_by("-created_at")[:3]:
                fallback_events.append(
                    {
                        "id": f"ai-{usage_log.id}",
                        "type": "ai",
                        "title": f"Used {usage_log.feature_name or 'AI Assistant'}",
                        "time": _time_ago(usage_log.created_at),
                        "sort_time": usage_log.created_at,
                    }
                )

            for query in Query.objects.filter(user=user).order_by("-created_at")[:3]:
                context = query.context if isinstance(query.context, dict) else {}
                if context.get("system_event"):
                    continue
                fallback_events.append(
                    {
                        "id": f"query-{query.id}",
                        "type": "ai",
                        "title": "Asked AI Assistant",
                        "time": _time_ago(query.created_at),
                        "sort_time": query.created_at,
                    }
                )

            fallback_events.sort(key=lambda item: item["sort_time"], reverse=True)
            recent_activity = [
                {
                    "id": item["id"],
                    "type": item["type"],
                    "title": item["title"],
                    "time": item["time"],
                }
                for item in fallback_events[:5]
            ]

        return Response(
            {
                "studentName": student_name,
                "stats": {
                    "coursesEnrolled": courses_enrolled,
                    "coursesTrend": "Based on your active subjects",
                    "notesCompleted": notes_count,
                    "notesTrend": f"+{notes_this_week} this week" if notes_this_week else "No new notes this week",
                    "testsCompleted": tests_completed,
                    "testsTrend": tests_trend,
                    "studyHours": study_hours_total,
                    "studyHoursTrend": f"{_format_hours_label(study_hours_week)} this week",
                },
                "recentNotes": recent_notes,
                "upcomingTests": upcoming_tests,
                "schedules": upcoming_tests,
                "recentActivity": recent_activity,
            },
            status=status.HTTP_200_OK,
        )


class StudentOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    _SUBJECT_COLORS = [
        "bg-blue-500",
        "bg-orange-500",
        "bg-emerald-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-cyan-500",
    ]

    def get(self, request):
        user = request.user
        today = timezone.localdate()
        start_day = today - timedelta(days=6)

        daily_map = {}
        for i in range(7):
            day = start_day + timedelta(days=i)
            daily_map[day] = {
                "name": day.strftime("%a"),
                "hours": 0.0,
                "notes": 0,
                "score_values": [],
            }

        notes_week_rows = (
            Note.objects.filter(created_by=user, created_at__date__gte=start_day)
            .values("created_at__date")
            .annotate(count=Count("id"))
        )
        for row in notes_week_rows:
            day = row["created_at__date"]
            if day in daily_map:
                daily_map[day]["notes"] = row["count"]

        score_week_rows = (
            Submission.objects.filter(
                user=user,
                status__in=[SubmissionStatus.SUBMITTED, SubmissionStatus.EVALUATED],
                created_at__date__gte=start_day,
            )
            .exclude(score__isnull=True)
            .values("created_at__date")
            .annotate(avg_score=Avg("score"))
        )
        for row in score_week_rows:
            day = row["created_at__date"]
            if day in daily_map and row["avg_score"] is not None:
                daily_map[day]["score_values"].append(float(row["avg_score"]))

        for log in ActivityLog.objects.filter(user=user, created_at__date__gte=start_day).only("created_at", "metadata"):
            day = timezone.localtime(log.created_at).date()
            if day in daily_map:
                daily_map[day]["hours"] += _extract_study_minutes(log.metadata) / 60

        chart_data = []
        for i in range(7):
            day = start_day + timedelta(days=i)
            entry = daily_map[day]
            score_values = entry["score_values"]
            chart_data.append(
                {
                    "name": entry["name"],
                    "hours": round(entry["hours"], 1),
                    "notes": int(entry["notes"]),
                    "score": round(sum(score_values) / len(score_values), 1) if score_values else 0,
                }
            )

        notes_by_subject_rows = (
            Note.objects.filter(created_by=user)
            .exclude(subject__isnull=True)
            .values("subject__name")
            .annotate(notes_count=Count("id"))
            .order_by("subject__name")
        )
        scores_by_subject_rows = (
            Submission.objects.filter(
                user=user,
                status__in=[SubmissionStatus.SUBMITTED, SubmissionStatus.EVALUATED],
            )
            .exclude(exam__subject__isnull=True)
            .values("exam__subject__name")
            .annotate(avg_score=Avg("score"), attempts=Count("id"))
            .order_by("exam__subject__name")
        )

        subject_map = {}
        for row in notes_by_subject_rows:
            subject_name = row["subject__name"]
            if not subject_name:
                continue
            subject_map[subject_name] = {
                "notes_count": row["notes_count"],
                "avg_score": None,
                "attempts": 0,
            }

        for row in scores_by_subject_rows:
            subject_name = row["exam__subject__name"]
            if not subject_name:
                continue
            current = subject_map.get(
                subject_name,
                {"notes_count": 0, "avg_score": None, "attempts": 0},
            )
            current["avg_score"] = float(row["avg_score"]) if row["avg_score"] is not None else None
            current["attempts"] = row["attempts"]
            subject_map[subject_name] = current

        subject_progress = []
        sorted_subjects = sorted(subject_map.items(), key=lambda item: item[0].lower())
        for idx, (subject_name, details) in enumerate(sorted_subjects):
            notes_score = min(details["notes_count"] * 10, 70)
            test_score_component = 0
            if details["avg_score"] is not None:
                test_score_component = min(details["avg_score"] * 0.3, 30)
            progress_value = round(min(notes_score + test_score_component, 100))

            subject_progress.append(
                {
                    "name": subject_name,
                    "progress": progress_value,
                    "color": self._SUBJECT_COLORS[idx % len(self._SUBJECT_COLORS)],
                    "notesCount": details["notes_count"],
                    "avgScore": details["avg_score"],
                }
            )

        insights = []
        if subject_progress:
            most_studied = max(subject_progress, key=lambda item: item.get("notesCount", 0))
            if most_studied.get("notesCount", 0) > 0:
                insights.append(
                    {
                        "id": "most-studied",
                        "type": "success",
                        "title": "Most Studied Subject",
                        "message": f"You've created {most_studied['notesCount']} notes in {most_studied['name']}. Keep it up!",
                    }
                )

            scored_subjects = [item for item in subject_progress if item.get("avgScore") is not None]
            if scored_subjects:
                weakest = min(scored_subjects, key=lambda item: item["avgScore"])
                insights.append(
                    {
                        "id": "needs-attention",
                        "type": "warning",
                        "title": "Needs Attention",
                        "message": f"{weakest['name']} average score is {round(weakest['avgScore'], 1)}%. Focus on revision this week.",
                    }
                )

            lowest_progress = min(subject_progress, key=lambda item: item["progress"])
            insights.append(
                {
                    "id": "recommended-topic",
                    "type": "info",
                    "title": "Recommended Focus",
                    "message": f"Prioritize {lowest_progress['name']} to improve your overall progress.",
                }
            )

        return Response(
            {
                "chartData": chart_data,
                "subjectProgress": subject_progress,
                "insights": insights,
            },
            status=status.HTTP_200_OK,
        )


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.localdate()

        total_users = User.objects.count()
        active_students = User.objects.filter(_role_filter(UserRole.STUDENT), is_active=True).count()
        active_teachers = User.objects.filter(_role_filter(UserRole.FACULTY), is_active=True).count()

        ai_requests_today = AIUsageLog.objects.filter(created_at__date=today).count()
        if ai_requests_today == 0:
            ai_requests_today = Note.objects.filter(created_at__date=today).exclude(ai_model="").count()

        storage_bytes = File.objects.aggregate(total=Sum("size_bytes"))["total"] or 0

        activities = []

        for user in User.objects.order_by("-date_joined")[:4]:
            activities.append(
                {
                    "id": f"user-{user.id}",
                    "type": "user_registered",
                    "message": f"New user registered: {user.email}",
                    "time": _time_ago(user.date_joined),
                    "sort_time": user.date_joined,
                }
            )

        for note in Note.objects.order_by("-created_at")[:4]:
            note_type = "ai_spike" if (note.ai_model or "").strip() else "notes_uploaded"
            note_message = f"AI-generated note created: {note.title}" if note_type == "ai_spike" else f"New note created: {note.title}"
            activities.append(
                {
                    "id": f"note-{note.id}",
                    "type": note_type,
                    "message": note_message,
                    "time": _time_ago(note.created_at),
                    "sort_time": note.created_at,
                }
            )

        for usage in AIUsageLog.objects.select_related("user").order_by("-created_at")[:4]:
            activities.append(
                {
                    "id": f"ai-{usage.id}",
                    "type": "ai_spike",
                    "message": f"AI request: {usage.feature_name}",
                    "time": _time_ago(usage.created_at),
                    "sort_time": usage.created_at,
                }
            )

        activities = sorted(activities, key=lambda item: item["sort_time"], reverse=True)[:6]
        recent_activity = [
            {
                "id": item["id"],
                "type": item["type"],
                "message": item["message"],
                "time": item["time"],
            }
            for item in activities
        ]

        return Response(
            {
                "totalUsers": total_users,
                "activeStudents": active_students,
                "activeTeachers": active_teachers,
                "aiRequestsToday": ai_requests_today,
                "storageUsed": _format_storage_size(storage_bytes),
                "recentActivity": recent_activity,
            }
        )


class AdminSystemAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        now = timezone.now()
        today = timezone.localdate()
        month_start = today.replace(day=1)
        week_start = today - timedelta(days=6)

        daily_active_users = _distinct_user_count(
            User.objects.filter(last_login__date=today, is_active=True).values_list("id", flat=True),
            ActivityLog.objects.filter(created_at__date=today).values_list("user_id", flat=True),
            AIUsageLog.objects.filter(created_at__date=today).values_list("user_id", flat=True),
            File.objects.filter(created_at__date=today).values_list("uploaded_by_id", flat=True),
            Note.objects.filter(created_at__date=today).values_list("created_by_id", flat=True),
        )
        uploads_monthly = File.objects.filter(created_at__date__gte=month_start).count()

        session_durations = []
        for log in ActivityLog.objects.filter(
            created_at__date__gte=week_start,
            action__in=["session_ended", "logout"],
        ).only("metadata"):
            seconds = _metadata_number(
                log.metadata,
                "session_duration_seconds",
                "duration_seconds",
                "sessionDurationSeconds",
            )
            if seconds is None:
                minutes = _metadata_number(log.metadata, "session_minutes", "duration_minutes", "sessionDurationMinutes")
                seconds = minutes * 60 if minutes is not None else None
            if seconds is not None:
                session_durations.append(seconds)

        if not session_durations:
            activity_spans = (
                ActivityLog.objects.filter(created_at__date__gte=week_start)
                .exclude(user__isnull=True)
                .values("user_id", "created_at__date")
                .annotate(first_event=Min("created_at"), last_event=Max("created_at"), event_count=Count("id"))
            )
            for span in activity_spans:
                if span["event_count"] > 1:
                    session_durations.append((span["last_event"] - span["first_event"]).total_seconds())

        average_session_seconds = sum(session_durations) / len(session_durations) if session_durations else 0
        avg_session_length = _format_duration(average_session_seconds)

        total_days = (today - month_start).days + 1
        active_days = set(
            ActivityLog.objects.filter(created_at__date__gte=month_start).values_list("created_at__date", flat=True)
        )
        active_days.update(
            AIUsageLog.objects.filter(created_at__date__gte=month_start).values_list("created_at__date", flat=True)
        )
        active_days.update(
            File.objects.filter(created_at__date__gte=month_start).values_list("created_at__date", flat=True)
        )
        active_days.update(
            Note.objects.filter(created_at__date__gte=month_start).values_list("created_at__date", flat=True)
        )
        platform_uptime = f"{round((len(active_days) / total_days) * 100, 1) if total_days else 0}%"

        users_by_day = {
            item["date_joined__date"]: item["count"]
            for item in User.objects.filter(date_joined__date__gte=week_start)
            .values("date_joined__date")
            .annotate(count=Count("id"))
        }

        uploads_by_day = {
            item["created_at__date"]: item["count"]
            for item in File.objects.filter(created_at__date__gte=week_start)
            .values("created_at__date")
            .annotate(count=Count("id"))
        }

        ai_by_day = {
            item["created_at__date"]: item["count"]
            for item in AIUsageLog.objects.filter(created_at__date__gte=week_start)
            .values("created_at__date")
            .annotate(count=Count("id"))
        }
        if not ai_by_day:
            ai_by_day = {
                item["created_at__date"]: item["count"]
                for item in Note.objects.filter(created_at__date__gte=week_start)
                .exclude(ai_model="")
                .values("created_at__date")
                .annotate(count=Count("id"))
            }

        activity_by_day = {
            item["created_at__date"]: item["count"]
            for item in ActivityLog.objects.filter(created_at__date__gte=week_start)
            .exclude(user__isnull=True)
            .values("created_at__date")
            .annotate(count=Count("user_id", distinct=True))
        }
        login_by_day = {
            item["last_login__date"]: item["count"]
            for item in User.objects.filter(last_login__date__gte=week_start, is_active=True)
            .values("last_login__date")
            .annotate(count=Count("id", distinct=True))
        }
        note_users_by_day = {
            item["created_at__date"]: item["count"]
            for item in Note.objects.filter(created_at__date__gte=week_start)
            .exclude(created_by__isnull=True)
            .values("created_at__date")
            .annotate(count=Count("created_by_id", distinct=True))
        }
        file_users_by_day = {
            item["created_at__date"]: item["count"]
            for item in File.objects.filter(created_at__date__gte=week_start)
            .exclude(uploaded_by__isnull=True)
            .values("created_at__date")
            .annotate(count=Count("uploaded_by_id", distinct=True))
        }

        running_total_users = User.objects.filter(date_joined__date__lt=week_start).count()
        user_growth = []
        system_usage = []

        for i in range(7):
            day = today - timedelta(days=6 - i)
            day_label = day.strftime("%b %d")

            new_users = users_by_day.get(day, 0) or 0
            running_total_users += new_users

            uploads = uploads_by_day.get(day, 0) or 0
            ai_queries = ai_by_day.get(day, 0) or 0
            active_sessions = max(
                activity_by_day.get(day, 0) or 0,
                login_by_day.get(day, 0) or 0,
                note_users_by_day.get(day, 0) or 0,
                file_users_by_day.get(day, 0) or 0,
            )

            user_growth.append({"date": day_label, "users": running_total_users})
            system_usage.append(
                {
                    "date": day_label,
                    "aiQueries": ai_queries,
                    "uploads": uploads,
                    "activeSessions": active_sessions,
                }
            )

        return Response(
            {
                "metrics": {
                    "dailyActiveUsers": daily_active_users,
                    "avgSessionLength": avg_session_length,
                    "totalUploadsMonthly": uploads_monthly,
                    "platformUptime": platform_uptime,
                },
                "userGrowth": user_growth,
                "systemUsage": system_usage,
                "generatedAt": now.isoformat(),
            }
        )


class AdminActivityLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        try:
            limit = int(request.query_params.get("limit", 500))
        except (TypeError, ValueError):
            limit = 500
        limit = max(1, min(limit, 1000))

        logs = ActivityLog.objects.select_related("user").order_by("-created_at")[:limit]

        serialized = []
        for log in logs:
            serialized.append(
                {
                    "id": str(log.id),
                    "user": _display_user_name(log.user),
                    "action": log.action or "Activity",
                    "module": _infer_module(log.action, log.entity_type),
                    "timestamp": log.created_at.isoformat(),
                    "status": _infer_status(log.metadata),
                }
            )

        if not serialized:
            fallback_items = []

            for user in User.objects.order_by("-date_joined")[: max(1, limit // 3)]:
                fallback_items.append(
                    {
                        "id": f"user-{user.id}",
                        "user": _display_user_name(user),
                        "action": "Account created",
                        "module": "User Management",
                        "timestamp": user.date_joined.isoformat(),
                        "status": "Success",
                    }
                )

            for file_obj in File.objects.select_related("uploaded_by").order_by("-created_at")[: max(1, limit // 3)]:
                fallback_items.append(
                    {
                        "id": f"file-{file_obj.id}",
                        "user": _display_user_name(file_obj.uploaded_by),
                        "action": f"Uploaded file: {file_obj.original_name}",
                        "module": "Knowledge Repo",
                        "timestamp": file_obj.created_at.isoformat(),
                        "status": "Success",
                    }
                )

            for note in Note.objects.select_related("created_by").order_by("-created_at")[: max(1, limit // 3)]:
                module = "AI Assistant" if (note.ai_model or "").strip() else "Knowledge Repo"
                action = f"Created note: {note.title}" if module == "Knowledge Repo" else f"AI note generated: {note.title}"
                fallback_items.append(
                    {
                        "id": f"note-{note.id}",
                        "user": _display_user_name(note.created_by),
                        "action": action,
                        "module": module,
                        "timestamp": note.created_at.isoformat(),
                        "status": "Success",
                    }
                )

            fallback_items.sort(key=lambda item: item["timestamp"], reverse=True)
            serialized = fallback_items[:limit]

        return Response(serialized, status=status.HTTP_200_OK)


class AdminStorageStatsView(APIView):
    permission_classes = [IsAuthenticated]

    TOTAL_CAPACITY_BYTES = 5 * 1024 * 1024 * 1024 * 1024

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        records = _storage_file_records(request)
        total_used = sum(record["sizeBytes"] for record in records)
        active_users = User.objects.filter(is_active=True).count() or 1
        per_user_avg = total_used // active_users

        files_count = len(records) or 1
        type_totals = {}
        for record in records:
            file_type = record["type"] or "other"
            current = type_totals.setdefault(file_type, {"count": 0, "sizeBytes": 0})
            current["count"] += 1
            current["sizeBytes"] += record["sizeBytes"]

        by_type = []
        for file_type, totals in sorted(type_totals.items(), key=lambda item: item[1]["count"], reverse=True):
            by_type.append(
                {
                    "type": file_type.upper(),
                    "count": totals["count"],
                    "value": round((totals["count"] / files_count) * 100, 1),
                    "size": _format_storage_size(totals["sizeBytes"]),
                }
            )

        available = max(self.TOTAL_CAPACITY_BYTES - total_used, 0)

        return Response(
            {
                "totalUsed": _format_storage_size(total_used),
                "available": _format_storage_size(available),
                "perUserAvg": _format_storage_size(per_user_avg),
                "byType": by_type,
                "filesCount": len(records),
                "capacity": {
                    "total": _format_storage_size(self.TOTAL_CAPACITY_BYTES),
                    "usedPercent": round((total_used / self.TOTAL_CAPACITY_BYTES) * 100, 1) if self.TOTAL_CAPACITY_BYTES else 0,
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminStorageFilesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        try:
            limit = int(request.query_params.get("limit", 500))
        except (TypeError, ValueError):
            limit = 500
        limit = max(1, min(limit, 1000))

        serialized = []
        for record in _storage_file_records(request)[:limit]:
            serialized.append(
                {
                    "id": record["id"],
                    "name": record["name"],
                    "type": record["type"].upper(),
                    "size": _format_storage_size(record["sizeBytes"]),
                    "sizeBytes": record["sizeBytes"],
                    "uploadedBy": record["uploadedBy"],
                    "date": _format_date_short(record["createdAt"]),
                    "source": record["source"],
                    "url": record["url"],
                }
            )

        return Response(serialized, status=status.HTTP_200_OK)


class AdminStorageFileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        source = "file"
        raw_id = str(file_id)
        if ":" in raw_id:
            source, raw_id = raw_id.split(":", 1)

        if source == "file":
            file_obj = File.objects.filter(id=raw_id).first()
            if not file_obj:
                return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
            file_obj.delete()
        elif source == "material":
            material = StudyMaterial.objects.filter(id=raw_id).first()
            if not material:
                return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
            material.delete()
        elif source == "project":
            project = Project.objects.filter(id=raw_id).first()
            if not project:
                return Response({"detail": "File not found."}, status=status.HTTP_404_NOT_FOUND)
            project.delete()
        else:
            return Response({"detail": "Unsupported storage source."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminAIUsageStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not _ensure_admin(request.user):
            return Response({"detail": "Admin privileges are required."}, status=status.HTTP_403_FORBIDDEN)

        today = timezone.localdate()
        usage_qs = AIUsageLog.objects.select_related("user")

        queries_per_day = {
            item["created_at__date"]: item["count"]
            for item in usage_qs.filter(created_at__date__gte=today - timedelta(days=6))
            .values("created_at__date")
            .annotate(count=Count("id"))
        }

        if not queries_per_day:
            fallback = (
                QueryResponseModel.objects.filter(created_at__date__gte=today - timedelta(days=6))
                .values("created_at__date")
                .annotate(count=Count("id"))
            )
            queries_per_day = {item["created_at__date"]: item["count"] for item in fallback}
        if not queries_per_day:
            fallback = (
                Note.objects.filter(created_at__date__gte=today - timedelta(days=6))
                .exclude(ai_model="")
                .values("created_at__date")
                .annotate(count=Count("id"))
            )
            queries_per_day = {item["created_at__date"]: item["count"] for item in fallback}

        timeline = []
        for i in range(7):
            day = today - timedelta(days=6 - i)
            timeline.append({"date": day.strftime("%b %d"), "queries": queries_per_day.get(day, 0) or 0})

        top_feature_rows = (
            usage_qs.values("feature_name")
            .annotate(value=Count("id"))
            .order_by("-value")[:5]
        )
        top_features = [{"name": row["feature_name"] or "Unknown", "value": row["value"]} for row in top_feature_rows]

        active_users_rows = (
            usage_qs.exclude(user__isnull=True)
            .values("user_id", "user__email", "user__first_name", "user__last_name")
            .annotate(queries=Count("id"))
            .order_by("-queries")[:5]
        )
        active_users = []
        for row in active_users_rows:
            full_name = f"{(row['user__first_name'] or '').strip()} {(row['user__last_name'] or '').strip()}".strip()
            active_users.append({"name": full_name or row["user__email"], "queries": row["queries"]})

        totals = usage_qs.aggregate(
            total_input=Sum("input_tokens"),
            total_output=Sum("output_tokens"),
            avg_latency=Sum("latency_ms"),
            total_count=Count("id"),
        )

        total_input = totals["total_input"] or 0
        total_output = totals["total_output"] or 0
        total_tokens = total_input + total_output
        total_count = totals["total_count"] or 0
        total_latency = totals["avg_latency"] or 0
        avg_latency_ms = int(total_latency / total_count) if total_count else 0

        total_active_ai_users = usage_qs.exclude(user__isnull=True).values("user_id").distinct().count()

        if not top_features:
            fallback_features = (
                QueryResponseModel.objects.values("model_name")
                .annotate(value=Count("id"))
                .order_by("-value")[:5]
            )
            top_features = [{"name": row["model_name"] or "AI Chat", "value": row["value"]} for row in fallback_features]
        if not top_features:
            fallback_features = (
                Note.objects.exclude(ai_model="")
                .values("ai_model")
                .annotate(value=Count("id"))
                .order_by("-value")[:5]
            )
            top_features = [{"name": row["ai_model"] or "Unknown", "value": row["value"]} for row in fallback_features]

        if not active_users:
            fallback_active_users_rows = (
                QueryResponseModel.objects.exclude(query__user__isnull=True)
                .values("query__user_id", "query__user__email", "query__user__first_name", "query__user__last_name")
                .annotate(queries=Count("id"))
                .order_by("-queries")[:5]
            )
            for row in fallback_active_users_rows:
                full_name = f"{(row['query__user__first_name'] or '').strip()} {(row['query__user__last_name'] or '').strip()}".strip()
                active_users.append({"name": full_name or row["query__user__email"], "queries": row["queries"]})
        if not active_users:
            fallback_active_users_rows = (
                Note.objects.exclude(ai_model="")
                .values("created_by_id", "created_by__email", "created_by__first_name", "created_by__last_name")
                .annotate(queries=Count("id"))
                .order_by("-queries")[:5]
            )
            for row in fallback_active_users_rows:
                full_name = f"{(row['created_by__first_name'] or '').strip()} {(row['created_by__last_name'] or '').strip()}".strip()
                active_users.append({"name": full_name or row["created_by__email"], "queries": row["queries"]})

        if total_active_ai_users == 0:
            total_active_ai_users = (
                QueryResponseModel.objects.exclude(query__user__isnull=True)
                .values("query__user_id")
                .distinct()
                .count()
            )
        if total_active_ai_users == 0:
            total_active_ai_users = Note.objects.exclude(ai_model="").values("created_by_id").distinct().count()

        if total_count == 0:
            response_rows = QueryResponseModel.objects.select_related("query").only(
                "response_text",
                "latency_ms",
                "token_usage",
                "query__prompt",
            )
            total_count = response_rows.count()
            total_tokens = 0
            total_latency = 0
            for response_obj in response_rows:
                total_tokens += _query_response_token_count(response_obj, "input_tokens", response_obj.query.prompt)
                total_tokens += _query_response_token_count(response_obj, "output_tokens", response_obj.response_text)
                total_latency += response_obj.latency_ms or 0
            avg_latency_ms = int(total_latency / total_count) if total_count else 0

        cost_total = usage_qs.aggregate(total=Sum("cost_usd"))["total"] or Decimal("0")

        return Response(
            {
                "queriesPerDay": timeline,
                "topFeatures": top_features,
                "activeUsers": active_users,
                "summary": {
                    "totalTokens": total_tokens,
                    "avgGenTimeSeconds": round(avg_latency_ms / 1000, 2),
                    "activeAiUsers": total_active_ai_users,
                    "totalCostUsd": str(cost_total),
                },
            },
            status=status.HTTP_200_OK,
        )
