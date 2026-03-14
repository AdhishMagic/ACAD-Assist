import aiohttp
from django.conf import settings

class AIClient:
    def __init__(self):
        self.base_url = "http://localhost:8001/api/v1" # Fallback local URL
        
    async def generate_chat(self, prompt, model="phi-3-mini"):
        async with aiohttp.ClientSession() as session:
            payload = {"message": prompt, "model": model}
            async with session.post(f"{self.base_url}/chat/", json=payload) as response:
                return await response.json()
