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
