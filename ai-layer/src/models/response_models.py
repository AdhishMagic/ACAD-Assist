"""Response models for API endpoints."""

from pydantic import BaseModel
from typing import Optional


class QueryResponse(BaseModel):
    """Query response model."""
    answer: str
    confidence: Optional[float] = None
    source_documents: Optional[list] = None


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    version: str = "v1"


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None


class FeedbackResponse(BaseModel):
    """Feedback acknowledgment response model."""
    status: str
    query_id: str
