from typing import Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from app.core.config import settings
from app.core.logger import logger

class LLMService:
    def __init__(self):
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash", 
                temperature=0.7,
                google_api_key=settings.GOOGLE_API_KEY
            )
            logger.info("LLM Service initialized")
        except Exception as e:
            logger.error(f"Failed to initialize LLM Service: {e}")
            # handle gracefully if key is missing during init
            self.llm = None

    async def generate_answer(self, query: str, context: str) -> str:
        if not self.llm:
            return "Error: LLM not initialized. Check API Key."
            
        prompt = f"""Answer the question based only on the following context:
        {context}

        Question: {query}
        """
        try:
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            return response.content
        except Exception as e:
            logger.error(f"LLM Generation Error: {e}")
            return "An error occurred during answer generation."

llm_service = LLMService()
