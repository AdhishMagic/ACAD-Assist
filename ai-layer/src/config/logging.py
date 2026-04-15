"""Logging configuration."""

import logging
from config.settings import settings

# Get logger
logger = logging.getLogger(__name__)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
