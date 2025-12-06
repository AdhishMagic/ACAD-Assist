import asyncio
import sys
import os

# Ensure backend modules can be imported
sys.path.append(os.getcwd())

from app.core.config import settings
from app.core.logger import setup_logging, logger

# Import modular components
from ingestion.pdf_loader import load_pdfs
from ingestion.text_extractor import text_extractor
from ingestion.chunker import chunker
from ingestion.embedder import get_embedder
from ingestion.vectordb_uploader import uploader

setup_logging()

async def main():
    logger.info("Starting Offline Ingestion Pipeline (Local Embeddings)...")

    # 1. LOAD PDFs
    data_path = settings.PDF_DATA_PATH
    pdf_files = load_pdfs(data_path)
    
    if not pdf_files:
        logger.warning("No PDFs found. Exiting.")
        return

    # Initialize Embedder (loads model once)
    embedder = get_embedder()
    
    # Ensure Collection Exists (Dynamic based on embedder type)
    await uploader.ensure_collection(vector_size=embedder.vector_size)

    total_files = len(pdf_files)
    logger.info(f"Files to process: {total_files}")

    for i, pdf_path in enumerate(pdf_files):
        logger.info(f"--- Processing {i+1}/{total_files}: {pdf_path.name} ---")
        
        # 2. EXTRACT TEXT
        text = text_extractor.process_pdf(str(pdf_path))
        
        if not text:
            logger.warning(f"Skipping {pdf_path.name} (No text extracted)")
            continue
            
        logger.info(f"Sample extracted text: {text[:200]}...")

        # 3. CHUNK
        chunks = chunker.chunk_text(text)
        if not chunks:
            logger.warning(f"Skipping {pdf_path.name} (No chunks generated)")
            continue
            
        logger.info(f"First chunk preview: {chunks[0][:200]}...")

        # 4. EMBED (Fully Local)
        try:
            vectors = embedder.embed(chunks)
            logger.info(f"Generated {len(vectors)} vectors.")
            if vectors:
                logger.info(f"Sample vector length: {len(vectors[0])}")
        except Exception as e:
            logger.error(f"Embedding failed for {pdf_path.name}: {e}")
            continue

        if len(chunks) != len(vectors):
            logger.error("Mismatch between chunks and embeddings count.")
            continue

        # 5. UPLOAD
        metadatas = [{"source": str(pdf_path), "page_approx": j} for j in range(len(chunks))]
        
        try:
            await uploader.upload_chunks(chunks, vectors, metadatas)
        except Exception as e:
            logger.error(f"Upload failed for {pdf_path.name}: {e}")

    logger.info("Ingestion Pipeline Complete.")

if __name__ == "__main__":
    asyncio.run(main())
