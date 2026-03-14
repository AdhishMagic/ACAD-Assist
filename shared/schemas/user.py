"""Shared Pydantic schemas for cross-service data validation."""

from dataclasses import dataclass
from typing import Optional


@dataclass
class UserSchema:
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool = True
    avatar_url: Optional[str] = None
