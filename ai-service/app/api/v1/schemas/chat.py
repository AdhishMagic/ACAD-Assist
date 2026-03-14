from pydantic import BaseModel, Field
from typing import List, Optional

class Message(BaseModel):
    role: str = Field(..., description="Role of the sender (user, assistant, system)")
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = Field(default="phi-3-mini", description="Model to use for inference")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, ge=1, le=4096)
    stream: bool = Field(default=False)

class ChatResponse(BaseModel):
    model: str
    message: Message
    usage: Optional[dict] = None
