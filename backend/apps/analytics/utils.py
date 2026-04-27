from uuid import UUID

from apps.analytics.models import ActivityLog


def _normalize_entity_id(entity_id, payload):
    if entity_id in (None, ""):
        return None
    if isinstance(entity_id, UUID):
        return entity_id

    try:
        return UUID(str(entity_id))
    except (TypeError, ValueError):
        payload.setdefault("entityRef", str(entity_id))
        return None


def record_activity(*, user=None, action="", entity_type="", entity_id=None, status="success", metadata=None):
    payload = dict(metadata or {})
    if status and "status" not in payload:
        payload["status"] = status
    normalized_entity_id = _normalize_entity_id(entity_id, payload)

    try:
        ActivityLog.objects.create(
            user=user,
            action=action or "activity",
            entity_type=entity_type or "",
            entity_id=normalized_entity_id,
            metadata=payload,
        )
    except Exception:
        return None

    return True
