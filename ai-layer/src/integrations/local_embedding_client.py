"""Local Embedding Client - Production-ready offline embeddings using sentence-transformers."""

import logging
from typing import List

logger = logging.getLogger(__name__)


class LocalEmbeddingClient:
    """
    Lightweight, production-ready local embedding client.
    
    Features:
    - Singleton model loading (cached at class level)
    - Fast inference on CPU or GPU
    - Batch processing support
    - Offline operation
    - No external API calls
    
    Default model: "all-MiniLM-L6-v2" (384-dim embeddings, 22MB)
    
    Example:
        >>> client = LocalEmbeddingClient()
        >>> embedding = client.embed("Hello world")
        >>> embeddings = client.embed_batch(["Text 1", "Text 2"])
    """
    
    # Class-level model cache (loaded once, shared across instances)
    _model = None
    _model_name = None
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize LocalEmbeddingClient.
        
        Args:
            model_name: HuggingFace model name (default: all-MiniLM-L6-v2)
                - all-MiniLM-L6-v2: 22MB, 384 dims, fastest
                - all-MiniLM-L12-v2: 27MB, 384 dims, more accurate
                - all-mpnet-base-v2: 438MB, 768 dims, highest quality
        """
        self.model_name = model_name
        # Don't load model here - defer until first use
    
    def _ensure_model_loaded(self):
        """Ensure model is loaded before use (lazy initialization)."""
        if LocalEmbeddingClient._model is None or LocalEmbeddingClient._model_name != self.model_name:
            self._load_model()
    
    def _load_model(self):
        """Load SentenceTransformer model (once per process)."""
        try:
            from sentence_transformers import SentenceTransformer
            
            logger.info(f"Loading embedding model: {self.model_name}")
            LocalEmbeddingClient._model = SentenceTransformer(self.model_name)
            LocalEmbeddingClient._model_name = self.model_name
            
            # Log model info
            model_dim = LocalEmbeddingClient._model.get_sentence_embedding_dimension()
            logger.info(f"Model loaded: {self.model_name} ({model_dim} dimensions)")
            
        except ImportError:
            logger.error("sentence-transformers not installed. Install with: pip install sentence-transformers")
            raise
        except Exception as e:
            logger.error(f"Failed to load embedding model {self.model_name}: {e}")
            raise
    
    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Input text to embed
            
        Returns:
            Embedding vector as list of floats
            
        Raises:
            ValueError: If text is empty
        """
        if not text or not isinstance(text, str):
            raise ValueError("Input must be a non-empty string")
        
        # Use batch method for consistency
        embeddings = self.embed_batch([text])
        return embeddings[0]
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (optimized for batch).
        
        Maintains strict ordering: output length always equals input length.
        Filters empty texts but preserves order by padding with None.
        
        Args:
            texts: List of input texts
            
        Returns:
            List of embedding vectors in same order as input.
            None entries for empty/whitespace-only texts.
            
        Raises:
            ValueError: If texts list is empty or contains non-strings
        """
        if not texts or not isinstance(texts, list):
            raise ValueError("Input must be a non-empty list of strings")
        
        if not all(isinstance(text, str) for text in texts):
            raise ValueError("All items must be strings")
        
        # Track non-empty texts with their original indices
        non_empty = [(i, text) for i, text in enumerate(texts) if text.strip()]
        
        if not non_empty:
            logger.warning("All input texts are empty")
            raise ValueError("No non-empty texts to embed")
        
        try:
            # Ensure model is loaded before use
            self._ensure_model_loaded()
            
            # Generate embeddings for non-empty texts only
            texts_to_embed = [text for _, text in non_empty]
            embeddings_array = LocalEmbeddingClient._model.encode(
                texts_to_embed,
                convert_to_numpy=True,
                show_progress_bar=False,
            )
            
            # Convert numpy array to list of lists
            embeddings_list = embeddings_array.astype(float).tolist()
            
            # Reconstruct full result maintaining input order
            # Empty texts get None, preserving exact 1:1 correspondence
            result = [None] * len(texts)
            for original_idx, embedding in zip([i for i, _ in non_empty], embeddings_list):
                result[original_idx] = embedding
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating embeddings for {len(texts_to_embed)} texts: {e}")
            raise
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of embeddings produced by this model.
        
        Returns:
            Number of dimensions in the embedding vector
        """
        # Ensure model is loaded before use
        self._ensure_model_loaded()
        
        return LocalEmbeddingClient._model.get_sentence_embedding_dimension()
