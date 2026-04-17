"""Embedding Service - Local embeddings using sentence-transformers."""

import logging
from typing import List
from integrations.local_embedding_client import LocalEmbeddingClient

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Production-ready embedding service using local models.
    
    Features:
    - Offline operation (no external API)
    - Singleton model management
    - Batch embedding support
    - CPU/GPU compatible
    
    Default model: "all-MiniLM-L6-v2" (384-dimensional embeddings)
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize Embedding Service.
        
        Args:
            model_name: HuggingFace model name for embeddings
        """
        self.model_name = model_name
        self.client = LocalEmbeddingClient(model_name=model_name)
        
        # Don't load model here - defer until first use
        logger.info(f"EmbeddingService initialized for model: {model_name} (lazy loading)")
    
    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for single text.
        
        Args:
            text: Input text
            
        Returns:
            Embedding vector
        """
        return self.client.embed(text)
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (optimized for batch).
        
        Args:
            texts: List of input texts
            
        Returns:
            List of embedding vectors (None for empty texts)
        """
        return self.client.embed_batch(texts)
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimensionality of embeddings from this service.
        
        Returns:
            Number of dimensions in each embedding vector
        """
        return self.client.get_embedding_dimension()
    
    # Backwards compatibility with old method names
    def generate_embedding(self, text: str) -> List[float]:
        """Deprecated: Use embed() instead."""
        return self.embed(text)
    
    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Deprecated: Use embed_batch() instead."""
        return self.embed_batch(texts)


embedding_service = EmbeddingService()
