from urllib.parse import parse_qs, urlparse

from apps.notifications.utils import create_notification
from db_design.constants import NotificationType


SUCCESS_METHOD_TO_LABEL = {
    "POST": "created",
    "PUT": "updated",
    "PATCH": "updated",
    "DELETE": "deleted",
}

EXCLUDED_PATH_PREFIXES = (
    "/admin",
    "/api/notifications",
    "/auth/login",
    "/auth/register",
    "/auth/token/refresh",
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/token/refresh",
)


def _humanize_path(path: str) -> str:
    segments = [
        segment.replace("-", " ").replace("_", " ")
        for segment in path.strip("/").split("/")
        if segment and segment != "api" and not _looks_like_identifier(segment)
    ]
    if not segments:
        return "action"
    return " ".join(segments[-3:])


def _looks_like_identifier(value: str) -> bool:
    compact = value.replace("-", "")
    return len(compact) >= 8 and compact.isalnum()


class ActionNotificationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if not self._should_notify(request, response):
            return response

        action_label = SUCCESS_METHOD_TO_LABEL[request.method]
        subject = _humanize_path(request.path)

        create_notification(
            user=request.user,
            title=f"Action {action_label}",
            message=f"{subject.title()} {action_label} successfully.",
            notification_type=NotificationType.SUCCESS,
            metadata={
                "source": "action_middleware",
                "path": request.path,
                "method": request.method,
                "status_code": response.status_code,
                "view_name": getattr(getattr(request, "resolver_match", None), "view_name", ""),
            },
            created_by=request.user,
        )
        return response

    def _should_notify(self, request, response) -> bool:
        if request.method not in SUCCESS_METHOD_TO_LABEL:
            return False
        if response.status_code not in {200, 201, 202, 204}:
            return False
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        path = request.path or ""
        if any(path.startswith(prefix) for prefix in EXCLUDED_PATH_PREFIXES):
            return False
        return True


def get_next_page_number(next_link: str | None) -> int | None:
    if not next_link:
        return None

    parsed = urlparse(next_link)
    page_value = parse_qs(parsed.query).get("page", [None])[0]
    if not page_value:
        return None

    try:
        return int(page_value)
    except (TypeError, ValueError):
        return None
