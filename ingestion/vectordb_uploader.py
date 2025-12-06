from typing import List, Dict, Any
from app.vectordb.client import get_vector_db_client
from app.core.config import settings
from app.core.logger import logger

class VectorDBUploader:
    def __init__(self):
        self.client = get_vector_db_client()

    async def ensure_collection(self, vector_size: int = 384):
        """
        Ensures the collection exists with the correct vector size.
        """
        await self.client.create_collection(
            collection_name=settings.COLLECTION_NAME,
            vector_size=vector_size
        )

    async def upload_chunks(self, chunks: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]]):
        """
        Upserts chunks to VectorDB.
        """
        if not chunks:
            return

        documents = []
        for text, meta in zip(chunks, metadatas):
            doc = {"text": text, **meta}
            documents.append(doc)

        try:
            logger.info(f"Upserting {len(documents)} vectors to Qdrant...")
            await self.client.upsert(documents=documents, embeddings=embeddings)
            logger.info("Upsert successful.")
        except Exception as e:
            logger.error(f"Upsert failed: {e}")
            raise

uploader = VectorDBUploader()
