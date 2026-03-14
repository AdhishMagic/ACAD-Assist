"""Datetime utility functions shared across services."""

from datetime import datetime, timezone


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def format_iso(dt: datetime) -> str:
    return dt.isoformat()


def parse_iso(dt_string: str) -> datetime:
    return datetime.fromisoformat(dt_string)
