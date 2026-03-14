"""Shared course schema."""

from dataclasses import dataclass, field
from typing import Optional, List


@dataclass
class CourseSchema:
    id: int
    title: str
    description: str
    instructor_id: int
    status: str = "draft"
    tags: List[str] = field(default_factory=list)
    thumbnail_url: Optional[str] = None
