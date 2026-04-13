from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "ACAD-Assist AI Service"
    API_V1_STR: str = "/api/v1"
    HF_TOKEN: str = ""
    DEFAULT_MODEL: str = "phi-3-mini"
    USE_GPU: bool = False

    model_config = SettingsConfigDict(case_sensitive=True, env_file=ROOT_ENV_FILE)

    @property
    def DEVICE(self) -> str:
        return "cuda" if self.USE_GPU else "cpu"

settings = Settings()
