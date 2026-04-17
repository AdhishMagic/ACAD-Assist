"""LLM Service - LLM interactions with vector retrieval integration."""

import logging
from typing import Optional, List, Dict

from integrations.vector_db_client import vector_db_client

logger = logging.getLogger(__name__)


class LLMService:
    """Service for LLM interactions with vector database retrieval."""
    
    def __init__(self):
        """Initialize LLM Service."""
        self.vector_db = vector_db_client
        logger.info("LLMService initialized with vector database retrieval")
    
    def retrieve_context(
        self,
        query: str,
        top_k: int = 5,
        department: Optional[str] = None,
        semester: Optional[str] = None,
        subject: Optional[str] = None,
    ) -> List[Dict]:
        """
        Retrieve relevant context from vector database for a query.
        
        This is the retrieval layer - converts query to embeddings and searches
        the vector database for similar documents with optional metadata filtering.
        
        Args:
            query: User query text
            top_k: Number of top results to retrieve (default: 5)
            department: Optional department filter (e.g., "Computer Science")
            semester: Optional semester filter (e.g., "Spring 2024")
            subject: Optional subject filter (e.g., "Algorithms")
            
        Returns:
            List of dicts with format:
                {
                    "text": str (retrieved chunk text),
                    "metadata": dict (chunk metadata),
                    "score": float (relevance score - lower is better)
                }
                
        Raises:
            ValueError: If query is empty or vector database is empty
            
        Example:
            >>> llm_service = LLMService()
            >>> # Without filters
            >>> context = llm_service.retrieve_context(
            ...     query="Explain photosynthesis",
            ...     top_k=5
            ... )
            >>> 
            >>> # With filters
            >>> context = llm_service.retrieve_context(
            ...     query="Explain photosynthesis",
            ...     top_k=5,
            ...     department="Biology",
            ...     semester="Spring 2024"
            ... )
            >>> for result in context:
            ...     print(f"Score: {result['score']}")
            ...     print(f"Text: {result['text'][:200]}")
            ...     print(f"Metadata: {result['metadata']}")
        """
        logger.info(f"Retrieving context for query: {query[:100]}...")
        
        try:
            results = self.vector_db.retrieve(
                query=query,
                top_k=top_k,
                department=department,
                semester=semester,
                subject=subject
            )
            logger.info(f"Retrieved {len(results)} context chunks")
            return results
        
        except ValueError as e:
            logger.warning(f"Retrieval failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Error retrieving context: {e}")
            raise
    
    def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        """
        Generate a response using LLM.
        
        Note: This is a placeholder. Actual LLM generation will be implemented
        in a future update. Currently, this method is a stub.
        
        Args:
            prompt: User prompt
            context: Optional context for the LLM
            
        Returns:
            Generated response from LLM
        """
        # Placeholder implementation
        return f"Response to: {prompt}"


llm_service = LLMService()
