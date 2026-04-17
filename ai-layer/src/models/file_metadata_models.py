"""File metadata data models for RAG indexing."""

import uuid
from pydantic import BaseModel, Field, validator


class FileMetadata(BaseModel):
    """
    Minimal file metadata for RAG indexing.
    
    Flat structure optimized for embedding pipeline.
    """
    
    # Unique identifier
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier (UUID v4)"
    )
    
    # Hierarchy
    department: str = Field(..., description="Department")
    semester: str = Field(..., description="Semester")
    subject: str = Field(..., description="Subject")
    
    # File info
    file_name: str = Field(..., description="File name with extension")
    file_path: str = Field(..., description="Absolute file path")
    file_size: int = Field(..., ge=0, description="File size in bytes")
    extension: str = Field(..., description="File extension")
    
    # Timestamp
    created_at: str = Field(..., description="ISO 8601 timestamp")
    
    @validator("extension")
    def validate_extension(cls, v):
        """Ensure extension is lowercase."""
        return v.lower()
    
    class Config:
        """Model config."""
        use_enum_values = True
    
    def to_indexable_dict(self) -> dict:
        """Convert to flat dictionary for RAG indexing."""
        return {
            "id": self.id,
            "department": self.department,
            "semester": self.semester,
            "subject": self.subject,
            "file_name": self.file_name,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "extension": self.extension,
            "created_at": self.created_at,
        }
