"""Application settings and configuration."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings."""
    
    APP_NAME: str = "ACAD-Assist AI Layer"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Vector Database Configuration
    VECTOR_DB_URL: str = os.getenv("VECTOR_DB_URL", "http://localhost:6333")
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
