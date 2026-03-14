class InferenceService:
    def __init__(self):
        # Stub for model initialization
        self.models = {
            "phi-3-mini": None,
            "llama-3": None,
            "mistral-7b": None
        }

    async def generate_response(self, request_data):
        # Stub for inference logic
        return {
            "model": request_data.model,
            "message": {
                "role": "assistant",
                "content": f"This is a mocked response from {request_data.model}."
            },
            "usage": {"prompt_tokens": 10, "completion_tokens": 15, "total_tokens": 25}
        }
    
    async def generate_stream(self, request_data):
        # Stub for streaming response
        words = ["This ", "is ", "a ", "streamed ", "mocked ", "response."]
        for word in words:
            yield word

inference_service = InferenceService()
