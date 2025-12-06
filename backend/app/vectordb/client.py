from abc import ABC, abstractmethod
from typing import List, Any
from app.core.config import settings
from app.core.logger import logger

class VectorDBClient(ABC):
    @abstractmethod
    async def search(self, query_vector: List[float], limit: int = 5) -> List[Any]:
        pass

    @abstractmethod
    async def upsert(self, documents: List[Any], embeddings: List[List[float]]) -> None:
        pass

    @abstractmethod
    async def create_collection(self, collection_name: str, vector_size: int) -> None:
        pass

class QdrantVectorClient(VectorDBClient):
    """
    Qdrant implementation of the VectorDBClient.
    """
    def __init__(self):
        try:
            from qdrant_client import QdrantClient
            self.client = QdrantClient(
                url=settings.VECTOR_DB_URL, 
                api_key=settings.VECTOR_DB_API_KEY,
                timeout=60  # Increase timeout for cloud operations
            )
            # Verify connection
            self.client.get_collections()
            logger.info("Qdrant client initialized and connected.")
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant client: {e}")
            raise

    async def search(self, query_vector: List[float], limit: int = 5) -> List[Any]:
        if not query_vector:
            logger.warning("Empty query vector provided to search")
            return []
            
        try:
            # query_points is the new API replacing search in QdrantClient 1.10+
            results = self.client.query_points(
                collection_name=settings.COLLECTION_NAME,
                query=query_vector,
                limit=limit
            ).points
            return results
        except Exception as e:
            logger.error(f"Qdrant search failed: {e}")
            # Try to distinguish between "collection not found" and other errors
            return []

    async def upsert(self, documents: List[Any], embeddings: List[List[float]]) -> None:
        from qdrant_client.http.models import PointStruct
        import uuid
        
        if len(documents) != len(embeddings):
            raise ValueError("Documents and embeddings must be of same length")
            
        points = []
        for doc, emb in zip(documents, embeddings):
            # Assuming doc is a dict with content/metadata
            # Generate a UUID for the point based on content or random
            point_id = str(uuid.uuid4())
            points.append(PointStruct(id=point_id, vector=emb, payload=doc))
            
        try:
            self.client.upsert(
                collection_name=settings.COLLECTION_NAME,
                points=points
            )
            logger.info(f"Upserted {len(points)} points to Qdrant")
        except Exception as e:
            logger.error(f"Qdrant upsert failed: {e}")
            raise

    async def create_collection(self, collection_name: str, vector_size: int) -> None:
        from qdrant_client.http.models import Distance, VectorParams
        try:
            # Check if exists first to avoid error or overwriting
            exists = self.client.collection_exists(collection_name=collection_name)
            if not exists:
                self.client.create_collection(
                    collection_name=collection_name,
                    vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
                )
                logger.info(f"Created collection '{collection_name}'")
            else:
                logger.info(f"Collection '{collection_name}' already exists")
        except Exception as e:
            logger.error(f"Failed to create collection: {e}")
            raise

# Factory to get client
def get_vector_db_client() -> VectorDBClient:
    return QdrantVectorClient()
