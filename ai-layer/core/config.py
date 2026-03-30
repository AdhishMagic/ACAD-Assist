import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ACAD-Assist AI Service"
    API_V1_STR: str = "/api/v1"
    
    # HuggingFace
    HF_TOKEN: str = os.environ.get("HF_TOKEN", "")
    
    # Model configs
    DEFAULT_MODEL: str = "phi-3-mini"
    DEVICE: str = "cuda" if os.environ.get("USE_GPU", "false").lower() == "true" else "cpu"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
