from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.rag.retriever import rag_retriever
from app.core.logger import logger

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@router.post("/chat", response_model=QueryResponse)
async def chat_endpoint(request: QueryRequest):
    """
    RAG Chat Endpoint
    """
    try:
        answer = await rag_retriever.process_query(request.query)
        return QueryResponse(answer=answer)
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
