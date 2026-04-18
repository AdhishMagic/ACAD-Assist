"""Request models for API endpoints."""

from pydantic import BaseModel, Field
from typing import Optional


class QueryRequest(BaseModel):
    """Query request model."""
    question: str = Field(..., description="User question/query")
    context: Optional[str] = Field(None, description="Optional context for the query")


class DocumentUploadRequest(BaseModel):
    """Document upload request model."""
    filename: str = Field(..., description="Name of the document")
    content: str = Field(..., description="Document content")


class FeedbackRequest(BaseModel):
    """Feedback request model."""
    query_id: str = Field(..., description="Query identifier")
    response_text: str = Field(..., description="Assistant response text")
    reaction: str = Field(..., description="User reaction such as like or dislike")
    comment: Optional[str] = Field(None, description="Optional feedback comment")
    metadata: Optional[dict] = Field(default_factory=dict, description="Optional feedback metadata")
