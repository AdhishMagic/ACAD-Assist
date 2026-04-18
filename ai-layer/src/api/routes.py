"""API routes."""

from fastapi import APIRouter, Depends
from models.request_models import FeedbackRequest, QueryRequest
from models.response_models import FeedbackResponse, QueryResponse, HealthResponse
from services.llm_service import llm_service
from config.settings import Settings
from api.dependencies import get_settings
from config.logging import logger

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


@router.post("/feedback", response_model=FeedbackResponse)
async def feedback(request: FeedbackRequest) -> FeedbackResponse:
    """Accept user feedback for RAG responses."""
    logger.info(
        "Received feedback query_id=%s reaction=%s comment_present=%s",
        request.query_id,
        request.reaction,
        bool(request.comment),
    )
    return FeedbackResponse(status="received", query_id=request.query_id)
