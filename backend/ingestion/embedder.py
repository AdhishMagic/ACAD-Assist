from typing import List
from sentence_transformers import SentenceTransformer
from app.core.logger import logger

class Embedder:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize strictly local SentenceTransformer model.
        Outputs 384-dimensional vectors.
        """
        try:
            logger.info(f"Loading local embedding model: {model_name}")
            self.model = SentenceTransformer(model_name)
            self.vector_size = 384
            logger.info("Loaded local embedding model")
        except Exception as e:
            logger.error(f"Failed to load local model: {e}")
            raise

    def embed(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of text strings into vectors.
        Returns a list of lists of floats.
        """
        if not texts:
            return []
            
        logger.info(f"Embedding {len(texts)} chunks...")
        try:
            # convert_to_numpy=True is default, but explicit as requested
            embeddings = self.model.encode(texts, convert_to_numpy=True)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise

# Singleton instance
_embedder = None
def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = Embedder()
    return _embedder
