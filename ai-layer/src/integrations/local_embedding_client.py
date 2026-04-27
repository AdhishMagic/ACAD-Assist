"""Local Embedding Client - Production-ready offline embeddings using sentence-transformers."""

import logging
import os
import threading
from typing import List, Optional

import numpy as np

logger = logging.getLogger(__name__)

DEFAULT_EMBEDDING_MODEL = "all-MiniLM-L6-v2"
MODEL_CACHE_DIR = "models/embedding"


def get_embedding_model(model_name: str = DEFAULT_EMBEDDING_MODEL):
    """
    Lazily load and cache the sentence-transformers embedding model.

    Args:
        model_name: HuggingFace/SentenceTransformers model name

    Returns:
        Loaded SentenceTransformer instance
    """
    if (
        LocalEmbeddingClient._model is None
        or LocalEmbeddingClient._model_name != model_name
    ):
        with LocalEmbeddingClient._model_lock:
            if (
                LocalEmbeddingClient._model is None
                or LocalEmbeddingClient._model_name != model_name
            ):
                try:
                    from sentence_transformers import SentenceTransformer

                    os.makedirs(MODEL_CACHE_DIR, exist_ok=True)

                    try:
                        logger.info("Loading embedding model from local cache")
                        LocalEmbeddingClient._model = SentenceTransformer(
                            model_name,
                            cache_folder=MODEL_CACHE_DIR,
                            local_files_only=True,
                        )
                    except Exception:
                        logger.warning(
                            "Embedding model not found locally. Downloading model: %s",
                            model_name,
                        )
                        LocalEmbeddingClient._model = SentenceTransformer(
                            model_name,
                            cache_folder=MODEL_CACHE_DIR,
                        )

                    os.environ["TRANSFORMERS_OFFLINE"] = "1"
                    os.environ["HF_HUB_OFFLINE"] = "1"
                    LocalEmbeddingClient._model_name = model_name

                    model_dim = LocalEmbeddingClient._model.get_sentence_embedding_dimension()
                    logger.info("Embedding model loaded successfully")
                    logger.info("Model loaded: %s (%s dimensions)", model_name, model_dim)

                except ImportError:
                    logger.error(
                        "sentence-transformers not installed. Install with: "
                        "pip install sentence-transformers"
                    )
                    raise
                except Exception as e:
                    logger.error(f"Embedding model load failed for {model_name}: {e}")
                    raise RuntimeError(
                        "Embedding model load failed: "
                        f"{e}. Ensure network access is available for the first download "
                        f"or the model is cached in '{MODEL_CACHE_DIR}'."
                    ) from e

    return LocalEmbeddingClient._model


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
    _model_lock = threading.Lock()
    DEFAULT_BATCH_SIZE = 32
    
    def __init__(self, model_name: str = DEFAULT_EMBEDDING_MODEL):
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
        get_embedding_model(self.model_name)
    
    def _load_model(self):
        """Load SentenceTransformer model (once per process)."""
        get_embedding_model(self.model_name)
    
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
    
    def embed_batch(
        self,
        texts: List[str],
        batch_size: int = DEFAULT_BATCH_SIZE,
    ) -> List[Optional[List[float]]]:
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
            return [None] * len(texts)
        
        texts_to_embed = [text for _, text in non_empty]

        try:
            # Ensure model is loaded before use
            self._ensure_model_loaded()

            # Generate embeddings for non-empty texts only
            embeddings_array = LocalEmbeddingClient._model.encode(
                texts_to_embed,
                batch_size=batch_size,
                convert_to_numpy=True,
                show_progress_bar=False,
            )
            
            # Normalize embeddings for vector DB compatibility.
            embeddings_list = [
                self._normalize_embedding(embedding)
                for embedding in embeddings_array
            ]
            
            # Reconstruct full result maintaining input order
            # Empty texts get None, preserving exact 1:1 correspondence
            result = [None] * len(texts)
            for original_idx, embedding in zip([i for i, _ in non_empty], embeddings_list):
                result[original_idx] = embedding
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating embeddings for {len(texts_to_embed)} texts: {e}")
            raise

    @staticmethod
    def _normalize_embedding(embedding) -> List[float]:
        """
        Normalize an embedding vector and convert it to a Python list.

        Args:
            embedding: Numpy-compatible embedding vector

        Returns:
            Normalized embedding as list of floats
        """
        embedding_array = np.array(embedding, dtype=float)
        norm = np.linalg.norm(embedding_array)

        if norm > 0:
            embedding_array = embedding_array / norm

        return [float(value) for value in embedding_array.tolist()]
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of embeddings produced by this model.
        
        Returns:
            Number of dimensions in the embedding vector
        """
        # Ensure model is loaded before use
        self._ensure_model_loaded()
        
        return LocalEmbeddingClient._model.get_sentence_embedding_dimension()
