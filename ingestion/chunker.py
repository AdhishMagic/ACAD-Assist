from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.logger import logger

class Chunker:
    def __init__(self, chunk_size: int = 1500, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk_text(self, text: str) -> List[str]:
        """
        Splits text into chunks.
        """
        if not text:
            return []
            
        chunks = self.splitter.split_text(text)
        
        # Filter empty chunks
        valid_chunks = [c for c in chunks if c.strip()]
        
        logger.info(f"Generated {len(valid_chunks)} chunks from text length {len(text)}.")
        return valid_chunks

chunker = Chunker()
