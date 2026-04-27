"""Application settings and configuration."""

import os

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - optional dependency fallback
    def load_dotenv() -> bool:
        """Fallback no-op when python-dotenv is unavailable."""
        return False

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
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "acad_assist")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "acad_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "acad_pass")
    VECTOR_DB_DIM: int = int(os.getenv("VECTOR_DB_DIM", "768"))
    VECTOR_DB_BATCH_SIZE: int = int(os.getenv("VECTOR_DB_BATCH_SIZE", "100"))
    VECTOR_DB_MIN_CONNECTIONS: int = int(os.getenv("VECTOR_DB_MIN_CONNECTIONS", "1"))
    VECTOR_DB_MAX_CONNECTIONS: int = int(os.getenv("VECTOR_DB_MAX_CONNECTIONS", "5"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
