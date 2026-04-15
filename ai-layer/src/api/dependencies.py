"""API dependencies."""

from config.settings import Settings, settings


def get_settings() -> Settings:
    """
    Get application settings.
    
    Returns:
        Settings object
    """
    return settings
