"""API routes."""

from fastapi import APIRouter, Depends
from models.request_models import QueryRequest
from models.response_models import QueryResponse, HealthResponse
from services.llm_service import llm_service
from config.settings import Settings
from api.dependencies import get_settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """
    Health check endpoint.
    
    Returns:
        Health status
    """
    return HealthResponse(status="ok", version="v1")


@router.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest) -> QueryResponse:
    """
    Process a query.
    
    Args:
        request: Query request
        
    Returns:
        Query response
    """
    # Placeholder implementation
    answer = llm_service.generate_response(request.question, request.context)
    
    return QueryResponse(
        answer=answer,
        confidence=0.85,
        source_documents=[]
    )


@router.post("/index")
async def index() -> dict[str, str]:
    """Trigger document indexing."""
    from services.pipeline_service import create_pipeline

    pipeline_service = create_pipeline()
    pipeline_service.index_documents()
    return {"status": "indexing_started"}
