"""Main FastAPI application."""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from config.settings import settings
from config.logging import logger
from api.routes import router

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="0.1.0"
)

# Include routers
app.include_router(router, prefix="/api", tags=["API"])


@app.get("/")
async def root():
    """
    Root endpoint.
    
    Returns:
        Welcome message
    """
    return {"message": "AI Layer Running"}


@app.on_event("startup")
async def startup_event():
    """Handle startup events."""
    logger.info(f"Starting {settings.APP_NAME}")


@app.on_event("shutdown")
async def shutdown_event():
    """Handle shutdown events."""
    logger.info(f"Shutting down {settings.APP_NAME}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
