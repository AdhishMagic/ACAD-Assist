import logging
import sys
from typing import Any

from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RAG Backend"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # LLM Settings
    GOOGLE_API_KEY: str | None = None
    
    # Vector DB Settings
    VECTOR_DB_URL: str = "http://localhost:6333"
    VECTOR_DB_API_KEY: str | None = None
    COLLECTION_NAME: str = "rag_collection"

    # Ingestion Settings
    PDF_DATA_PATH: str = "../data/pdfs"

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
