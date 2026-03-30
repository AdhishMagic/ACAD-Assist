from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from api.inference.v1.schemas.chat import ChatRequest, ChatResponse
from services.inference import inference_service

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    try:
        if request.stream:
            return StreamingResponse(
                inference_service.generate_stream(request), 
                media_type="text/event-stream"
            )
        
        response = await inference_service.generate_response(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

