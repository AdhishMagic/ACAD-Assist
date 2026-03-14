"""Shared document schema."""

from dataclasses import dataclass
from typing import Optional


@dataclass
class DocumentSchema:
    id: int
    title: str
    file_path: str
    file_type: str
    file_size: int
    uploaded_by: int
    course_id: Optional[int] = None
    description: Optional[str] = None
