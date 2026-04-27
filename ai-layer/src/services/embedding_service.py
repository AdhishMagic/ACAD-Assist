"""Embedding Service - Local embeddings using sentence-transformers."""

import logging
from typing import Dict, List, Optional

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
    
    DEFAULT_BATCH_SIZE = 32

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
    
    def embed_batch(
        self,
        texts: List[str],
        batch_size: int = DEFAULT_BATCH_SIZE,
    ) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts (optimized for batch).
        
        Args:
            texts: List of input texts
            
        Returns:
            List of embedding vectors (None for empty texts)
        """
        return self.client.embed_batch(texts, batch_size=batch_size)
    
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

    def generate_embeddings(
        self,
        chunks: List[Dict],
        batch_size: int = DEFAULT_BATCH_SIZE,
    ) -> List[Dict]:
        """
        Enrich chunks with embeddings using batched local inference.

        Args:
            chunks: List of chunk dictionaries with chunk_id, content, metadata
            batch_size: Batch size for model.encode()

        Returns:
            Same chunk structure with an added embedding field
        """
        if not chunks:
            logger.info("Total chunks: 0")
            logger.info(f"Batch size: {batch_size}")
            return []

        logger.info(f"Total chunks: {len(chunks)}")
        logger.info(f"Batch size: {batch_size}")

        texts = [chunk.get("content", "") for chunk in chunks]

        valid_chunk_count = 0
        skipped_chunk_count = 0
        for chunk, text in zip(chunks, texts):
            if isinstance(text, str) and text.strip():
                valid_chunk_count += 1
            else:
                chunk_id = chunk.get("chunk_id", "unknown")
                skipped_chunk_count += 1
                logger.warning(f"Skipped empty chunk: {chunk_id}")

        logger.info(f"Embedded: {valid_chunk_count}")
        logger.info(f"Skipped empty chunks: {skipped_chunk_count}")
        logger.info(f"Generating embeddings for {len(chunks)} chunks")

        if valid_chunk_count == 0:
            return [
                {
                    "chunk_id": chunk.get("chunk_id", "unknown"),
                    "content": chunk.get("content", ""),
                    "embedding": None,
                    "metadata": chunk.get("metadata", {}),
                }
                for chunk in chunks
            ]

        try:
            embeddings = self.embed_batch(texts, batch_size=batch_size)
        except Exception as e:
            logger.error(f"Batch embedding failed: {e}")
            embeddings = [None] * len(chunks)

        if len(embeddings) != len(chunks):
            logger.error(
                f"Chunk-embedding alignment mismatch: {len(chunks)} chunks, "
                f"{len(embeddings)} embeddings"
            )
            if len(embeddings) < len(chunks):
                embeddings = embeddings + [None] * (len(chunks) - len(embeddings))
            else:
                embeddings = embeddings[: len(chunks)]

        expected_dim = None
        for embedding in embeddings:
            if embedding is not None:
                expected_dim = len(embedding)
                logger.info(f"Embedding dimension: {expected_dim}")
                break

        if expected_dim is None:
            logger.warning("No valid embeddings were generated")

        enriched_chunks = []
        failure_count = 0

        for chunk, embedding in zip(chunks, embeddings):
            chunk_id = chunk.get("chunk_id", "unknown")
            try:
                if embedding is not None and expected_dim is not None and len(embedding) != expected_dim:
                    logger.error(
                        f"Embedding dimension mismatch for chunk_id {chunk_id}: "
                        f"expected {expected_dim}, got {len(embedding)}"
                    )
                    embedding = None
                    failure_count += 1

                enriched_chunks.append(
                    {
                        "chunk_id": chunk_id,
                        "content": chunk.get("content", ""),
                        "embedding": embedding,
                        "metadata": chunk.get("metadata", {}),
                    }
                )
                if embedding is None:
                    failure_count += 1
            except Exception as e:
                failure_count += 1
                logger.error(f"Failed embedding for chunk_id: {chunk_id}: {e}")
                enriched_chunks.append(
                    {
                        "chunk_id": chunk_id,
                        "content": chunk.get("content", ""),
                        "embedding": None,
                        "metadata": chunk.get("metadata", {}),
                    }
                )

        if failure_count:
            logger.error(f"Embedding generation completed with {failure_count} failures")

        return enriched_chunks


embedding_service = EmbeddingService()


def generate_embeddings(chunks: list) -> list:
    """Module-level helper for batch chunk embedding."""
    return embedding_service.generate_embeddings(chunks)
