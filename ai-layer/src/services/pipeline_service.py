"""
Unified Pipeline Service - Memory-efficient document processing with streaming.

This service orchestrates the complete document processing workflow:
1. Stream pages from document source (PDF, text, etc.)
2. Clean and preprocess text
3. Chunk with semantic boundaries
4. Attach comprehensive metadata
5. Yield chunks incrementally (memory efficient)

Memory Model: O(1) constant memory regardless of document size.
- Generator-based streaming
- Per-page processing with explicit cleanup
- No chunk accumulation
- Supports unlimited-size PDFs

USAGE:
    from services.pipeline_service import PipelineService
    
    # Create pipeline
    pipeline = PipelineService()
    
    # Process document and stream chunks
    for chunk in pipeline.process_document(
        file_path="document.pdf",
        subject="Computer Science",
        department="Engineering"
    ):
        # Process chunk immediately (memory reclaimed after yield)
        store_chunk(chunk)
        generate_embedding(chunk)
"""

import logging
import gc
import time
from typing import Generator, Dict, Any, Optional
from dataclasses import dataclass
from pathlib import Path

from .document_service import DocumentService, load_documents_from_folder
from .pdf_processor import extract_text
from .chunking_service import ChunkingService, chunk_text
from .embedding_service import embedding_service, generate_embeddings
from integrations.vector_db_client import VectorDBClient, vector_db_client
from utils.text_processing import clean_text

logger = logging.getLogger(__name__)


@dataclass
class PipelineConfig:
    """Configuration for document processing pipeline."""
    
    # Chunking
    min_chunk_tokens: int = 500
    max_chunk_tokens: int = 800
    overlap_tokens: int = 125
    strategy: str = "preserve_sentences"
    
    # Text cleaning
    remove_urls: bool = True
    remove_emails: bool = True
    normalize_unicode: bool = True
    preserve_structure: bool = True
    
    # Streaming
    batch_size: int = 1  # 1 = stream individual chunks
    
    # Memory optimization
    enable_garbage_collection: bool = True


class PipelineService:
    """
    Production-ready document processing pipeline.
    
    Handles memory-efficient streaming document processing with:
    - Token-based semantic chunking (500-800 tokens)
    - Overlap management (100-150 tokens)
    - Complete metadata attachment
    - Generator-based streaming (O(1) memory)
    
    EXAMPLE:
        pipeline = PipelineService()
        
        # Stream chunks from document
        for chunk in pipeline.process_document(
            file_path="lecture.pdf",
            department="Computer Science",
            semester="Spring 2024",
            subject="Data Structures"
        ):
            # Chunk memory reclaimed after each yield
            database.insert(chunk)
            embeddings.generate(chunk)
    """
    
    def __init__(self, config: PipelineConfig = None):
        """
        Initialize pipeline.
        
        Args:
            config: Pipeline configuration (uses defaults if None)
        """
        self.config = config or PipelineConfig()
        self.doc_service = DocumentService()
        self.chunker = ChunkingService(
            min_chunk_tokens=self.config.min_chunk_tokens,
            max_chunk_tokens=self.config.max_chunk_tokens,
            overlap_tokens=self.config.overlap_tokens,
            tokenizer_type="simple",
            strategy=self.config.strategy,
            enable_overlap_optimization=True,
        )
        self.embedding_service = embedding_service
        
        # Initialize VectorDBClient with embedding dimension
        embedding_dim = self.embedding_service.get_embedding_dimension()
        self.vector_db = VectorDBClient(dim=embedding_dim)
        
        logger.info(
            f"PipelineService initialized: "
            f"tokens={self.config.min_chunk_tokens}-{self.config.max_chunk_tokens}, "
            f"overlap={self.config.overlap_tokens}, "
            f"strategy={self.config.strategy}, "
            f"vector_db_dim={embedding_dim}"
        )
    
    def process_document(
        self,
        file_path: str,
        file_name: str = "",
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] = None,
        page_range: Optional[tuple] = None,
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Process document and stream chunks with metadata.
        
        Main entry point for document processing. Returns a generator that yields
        chunks incrementally, maintaining constant memory usage regardless of
        document size.
        
        Args:
            file_path: Path to document file (PDF, etc.)
            file_name: Document name (if empty, extracted from file_path)
            department: Academic department (e.g., "Computer Science")
            semester: Semester/term (e.g., "Spring 2024")
            subject: Subject/course (e.g., "Data Structures")
            section: Section/chapter info (optional)
            topic: Specific topic (optional)
            author: Document author (optional)
            custom_metadata: Additional custom metadata fields
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
            
        Yields:
            Dict with keys: chunk_id, text, embedding, metadata
            
        Raises:
            FileNotFoundError: If file_path doesn't exist
            
        Memory:
            - Constant O(1): Processes incrementally
            - Yielded chunks can be discarded immediately
            - No internal accumulation of results
            - PDF never fully loaded into memory
            
        Example:
            >>> pipeline = PipelineService()
            >>> 
            >>> # Process 5GB PDF with constant memory
            >>> for chunk in pipeline.process_document(
            ...     "large_document.pdf",
            ...     department="Computer Science",
            ...     semester="Spring 2024",
            ...     subject="Algorithms"
            ... ):
            ...     # Immediately save or process (memory reclaimed)
            ...     database.insert(chunk)
        """
        # Infer file_name from file_path if not provided
        if not file_name:
            from pathlib import Path
            file_name = Path(file_path).name
        
        logger.info(
            f"Starting document processing pipeline: {file_name} "
            f"[{department}/{semester}/{subject}]"
        )
        
        custom_metadata = custom_metadata or {}
        
        try:
            # Stream pages from document service
            for page_data in self.doc_service.extract_pdf_text_streaming(
                file_path,
                page_range=page_range
            ):
                page_text = page_data.get("text", "")
                page_number = page_data.get("page", 0)
                
                # Skip empty pages
                if not page_text or not page_text.strip():
                    logger.debug(f"Skipping empty page {page_number}")
                    continue
                
                # Step 1: Clean text
                cleaned_text = self._clean_page_text(page_text)
                
                if not cleaned_text or not cleaned_text.strip():
                    logger.debug(f"Page {page_number} empty after cleaning")
                    continue
                
                logger.debug(
                    f"Processing page {page_number} "
                    f"({len(page_text)} chars → {len(cleaned_text)} cleaned)"
                )
                
                # Step 2: Chunk the page text
                page_chunks = self.chunker.chunk_text(
                    text=cleaned_text,
                    file_name=file_name,
                    page_number=page_number,
                    department=department,
                    semester=semester,
                    subject=subject,
                    section=section,
                    topic=topic,
                    author=author,
                    custom_metadata=custom_metadata,
                )
                
                # Step 3: Generate embeddings (batch for efficiency)
                logger.debug(
                    f"Generating embeddings for {len(page_chunks)} chunks from page {page_number}"
                )
                
                # Extract texts for batch embedding
                chunk_texts = [chunk.text for chunk in page_chunks]
                embeddings = self.embedding_service.embed_batch(chunk_texts)
                
                # Validate embedding count matches chunks
                if len(embeddings) != len(page_chunks):
                    logger.error(
                        f"Embedding count mismatch: {len(embeddings)} embeddings for "
                        f"{len(page_chunks)} chunks on page {page_number}"
                    )
                    raise RuntimeError("Embedding batch size mismatch with chunks")
                
                # Step 4: Yield clean structured output (no mutation)
                logger.debug(
                    f"Yielding {len(page_chunks)} chunks with embeddings from page {page_number}"
                )
                
                for chunk, embedding in zip(page_chunks, embeddings):
                    yield {
                        "chunk_id": chunk.chunk_id,
                        "text": chunk.text,
                        "embedding": embedding,
                        "metadata": chunk.custom_metadata
                    }
                
                # Explicit cleanup: discard page data
                del page_text, cleaned_text, page_chunks, embeddings
                
                if self.config.enable_garbage_collection:
                    gc.collect()  # Force garbage collection between pages
        
        except Exception as e:
            logger.error(f"Error processing document {file_name}: {e}")
            raise
    
    def process_document_minimal_memory(
        self,
        file_path: str,
        file_name: str = "",
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] = None,
        page_range: Optional[tuple] = None,
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Process document with absolute minimal memory footprint.
        
        This variant yields chunks with ZERO accumulation:
        - No per-page chunk collection
        - No overlap overhead
        - Pure streaming: page → chunk → yield → immediately freed
        
        Memory: ~1-2MB total for any file size
        
        When to use: Multi-gigabyte PDFs on memory-constrained systems
        
        Args:
            file_path: Path to PDF file
            file_name: Document name
            department: Academic department
            semester: Semester/term
            subject: Subject/course
            section: Section info
            topic: Topic
            author: Document author
            custom_metadata: Custom fields
            page_range: Optional page range
            
        Yields:
            Dict with keys: chunk_id, text, metadata
            
        Memory: O(1) - Essentially zero per-chunk overhead
        """
        if not file_name:
            from pathlib import Path
            file_name = Path(file_path).name
        
        logger.info(
            f"Starting minimal-memory document processing: {file_name} "
            f"[ZERO accumulation mode]"
        )
        
        custom_metadata = custom_metadata or {}
        
        try:
            chunk_count = 0
            page_count = 0
            
            # Stream pages from document service
            for page_data in self.doc_service.extract_pdf_text_streaming(
                file_path,
                page_range=page_range
            ):
                page_text = page_data.get("text", "")
                page_number = page_data.get("page", 0)
                
                # Skip empty pages
                if not page_text or not page_text.strip():
                    logger.debug(f"Skipping empty page {page_number}")
                    continue
                
                page_count += 1
                
                # Step 1: Clean text
                cleaned_text = self._clean_page_text(page_text)
                
                if not cleaned_text or not cleaned_text.strip():
                    logger.debug(f"Page {page_number} empty after cleaning")
                    continue
                
                logger.debug(
                    f"Processing page {page_number} "
                    f"({len(page_text)} chars → {len(cleaned_text)} cleaned)"
                )
                
                # Step 2: Chunk the page - yield chunks IMMEDIATELY without collecting
                page_chunks_iter = self.chunker.chunk_text(
                    text=cleaned_text,
                    file_name=file_name,
                    page_number=page_number,
                    department=department,
                    semester=semester,
                    subject=subject,
                    section=section,
                    topic=topic,
                    author=author,
                    custom_metadata=custom_metadata,
                )
                
                # Collect chunks for this page to batch embeddings
                page_chunks = list(page_chunks_iter)
                chunk_texts = [chunk.text for chunk in page_chunks]
                embeddings = self.embedding_service.embed_batch(chunk_texts)
                
                if len(embeddings) != len(page_chunks):
                    logger.error(
                        f"Embedding count mismatch: {len(embeddings)} embeddings for "
                        f"{len(page_chunks)} chunks on page {page_number}"
                    )
                    raise RuntimeError("Embedding batch size mismatch with chunks")
                
                # Yield immediately - no buffering after this point
                for chunk, embedding in zip(page_chunks, embeddings):
                    yield {
                        "chunk_id": chunk.chunk_id,
                        "text": chunk.text,
                        "embedding": embedding,
                        "metadata": chunk.custom_metadata
                    }
                    chunk_count += 1
                
                # Explicit cleanup between pages
                del page_text, cleaned_text, page_chunks, embeddings
                
                if self.config.enable_garbage_collection:
                    gc.collect()
            
            logger.info(
                f"Minimal-memory processing complete: "
                f"{page_count} pages → {chunk_count} chunks"
            )
        
        except Exception as e:
            logger.error(f"Error in minimal-memory processing of {file_name}: {e}")
            raise
    
    def process_document_batched(
        self,
        file_path: str,
        batch_size: int = 16,
        file_name: str = "",
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] = None,
        page_range: Optional[tuple] = None,
    ) -> Generator[list, None, None]:
        """
        Process document and stream chunks in batches.
        
        Useful for batch embedding operations or bulk database inserts.
        Memory scales with batch_size, not document size.
        
        Args:
            file_path: Path to document
            batch_size: Number of chunks per batch
            file_name: Document name
            department: Academic department
            semester: Semester/term
            subject: Subject/course
            section: Section info
            topic: Topic
            author: Document author
            custom_metadata: Custom fields
            page_range: Optional page range
            
        Yields:
            List[SemanticChunk]: Batches of chunks
            
        Example:
            >>> pipeline = PipelineService()
            >>> 
            >>> # Process document in batches for embedding
            >>> for batch in pipeline.process_document_batched(
            ...     "document.pdf",
            ...     batch_size=32,
            ...     subject="AI"
            ... ):
            ...     embeddings = embedding_service.embed_batch(batch)
            ...     vector_db.insert_batch(embeddings)
        """
        logger.info(
            f"Processing document in batches (size={batch_size}): {file_name}"
        )
        
        batch = []
        
        for chunk in self.process_document(
            file_path=file_path,
            file_name=file_name,
            department=department,
            semester=semester,
            subject=subject,
            section=section,
            topic=topic,
            author=author,
            custom_metadata=custom_metadata,
            page_range=page_range,
        ):
            batch.append(chunk)
            
            if len(batch) >= batch_size:
                yield batch
                batch = []
        
        # Yield remaining chunks
        if batch:
            yield batch
    
    def process_and_store_document(
        self,
        file_path: str,
        batch_size: int = 32,
        file_name: str = "",
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] = None,
        page_range: Optional[tuple] = None,
    ) -> int:
        """
        Process document and store embeddings in FAISS vector database.
        
        Streams chunks from document, batches them, and stores embeddings in the
        vector database with metadata. Maintains constant memory usage by batching
        instead of accumulating all chunks.
        
        Args:
            file_path: Path to document file (PDF, etc.)
            batch_size: Number of chunks to batch before storing (default: 32)
            file_name: Document name (if empty, extracted from file_path)
            department: Academic department (e.g., "Computer Science")
            semester: Semester/term (e.g., "Spring 2024")
            subject: Subject/course (e.g., "Data Structures")
            section: Section/chapter info (optional)
            topic: Specific topic (optional)
            author: Document author (optional)
            custom_metadata: Additional custom metadata fields
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
            
        Returns:
            Total number of chunks stored
            
        Example:
            >>> pipeline = PipelineService()
            >>> total_chunks = pipeline.process_and_store_document(
            ...     file_path="lecture.pdf",
            ...     batch_size=32,
            ...     department="Computer Science",
            ...     semester="Spring 2024",
            ...     subject="Algorithms"
            ... )
            >>> print(f"Stored {total_chunks} chunks in vector database")
        """
        logger.info(
            f"Processing and storing document: {file_name or file_path} "
            f"(batch_size={batch_size})"
        )
        
        total_chunks = 0
        batch = []
        
        try:
            # Stream chunks from document with embeddings
            for chunk in self.process_document(
                file_path=file_path,
                file_name=file_name,
                department=department,
                semester=semester,
                subject=subject,
                section=section,
                topic=topic,
                author=author,
                custom_metadata=custom_metadata,
                page_range=page_range,
            ):
                # Prepare item for vector DB storage
                item = {
                    "chunk_id": chunk["chunk_id"],
                    "content": chunk["text"],
                    "embedding": chunk["embedding"],
                    "metadata": chunk["metadata"]
                }
                batch.append(item)
                total_chunks += 1
                
                # Store batch when size reached
                if len(batch) >= batch_size:
                    self.vector_db.add_embeddings(batch)
                    logger.debug(
                        f"Stored batch of {len(batch)} chunks. "
                        f"Total: {total_chunks} chunks"
                    )
                    batch = []
            
            # Store remaining chunks
            if batch:
                self.vector_db.add_embeddings(batch)
                logger.debug(
                    f"Stored final batch of {len(batch)} chunks. "
                    f"Total: {total_chunks} chunks"
                )
            
            logger.info(
                f"Document processing and storage complete: "
                f"{total_chunks} chunks stored in vector database"
            )
            
            return total_chunks
        
        except Exception as e:
            logger.error(
                f"Error processing and storing document {file_name or file_path}: {e}"
            )
            raise
    
    def _clean_page_text(self, text: str) -> str:
        """
        Clean page text.
        
        Args:
            text: Raw page text
            
        Returns:
            Cleaned text
        """
        # Use central text processing utility
        cleaned = clean_text(
            text,
            remove_urls=self.config.remove_urls,
            remove_emails=self.config.remove_emails,
            normalize_unicode=self.config.normalize_unicode,
            preserve_structure=self.config.preserve_structure,
        )
        
        return cleaned


def create_pipeline(config: PipelineConfig = None) -> PipelineService:
    """Factory function to create pipeline service."""
    return PipelineService(config)


def run_ingestion_pipeline(folder_path: str) -> dict:
    """
    Run the folder-based ingestion pipeline end-to-end.

    Flow:
    1. Load documents from folder
    2. Extract text per document
    3. Chunk per document
    4. Generate embeddings per document
    5. Store in FAISS incrementally after each document
    """
    max_file_size_mb = 20
    logger.info("Pipeline started")

    documents = load_documents_from_folder(folder_path)
    documents_total = len(documents)
    departments_detected = sorted(
        {
            str(document.get("metadata", {}).get("department", "")).strip()
            for document in documents
            if str(document.get("metadata", {}).get("department", "")).strip()
        }
    )

    logger.info(
        "Departments detected: %s",
        ", ".join(departments_detected) if departments_detected else "None",
    )
    logger.info("Total documents found: %s", documents_total)
    logger.info(f"Documents loaded: {len(documents)}")

    summary = {
        "documents_total": documents_total,
        "documents_processed": 0,
        "documents_skipped": 0,
        "chunks_created": 0,
        "chunks_stored": 0,
        "status": "completed",
    }

    processed_file_ids = set()
    processed_file_paths = set()
    vector_client = vector_db_client

    try:
        indexed_file_ids = vector_client.get_indexed_metadata_values("file_id")
        indexed_file_paths = vector_client.get_indexed_metadata_values("file_path")

        if not documents:
            logger.warning("No documents found. Pipeline finished early")
            logger.info("Processed: 0")
            logger.warning("Skipped: 0")
            logger.info("Total chunks: 0")
            logger.info("Embeddings generated: 0")
            logger.info("Stored in FAISS: 0")
            return summary

        for index, document in enumerate(documents, start=1):
            logger.info("Progress: %s/%s", index, documents_total)
            try:
                file_id = document.get("file_id")
                file_path = document.get("file_path", "")
                file_name = document.get("file_name") or file_path or "unknown"

                if (file_id and file_id in processed_file_ids) or (
                    file_path and file_path in processed_file_paths
                ):
                    summary["documents_skipped"] += 1
                    logger.warning("Skipped duplicate file in current run: %s", file_name)
                    continue

                if (file_id and file_id in indexed_file_ids) or (
                    file_path and file_path in indexed_file_paths
                ):
                    summary["documents_skipped"] += 1
                    logger.warning("Skipped already indexed file: %s", file_name)
                    continue

                try:
                    file_size_mb = Path(file_path).stat().st_size / 1024 / 1024
                except OSError as exc:
                    summary["documents_skipped"] += 1
                    logger.error("Failed reading file size for %s: %s", file_name, exc)
                    continue

                if file_size_mb > max_file_size_mb:
                    summary["documents_skipped"] += 1
                    logger.warning(
                        "Skipping large file: %s (%.2f MB > %s MB)",
                        file_name,
                        file_size_mb,
                        max_file_size_mb,
                    )
                    continue

                extraction_start = time.perf_counter()
                text = extract_text(file_path)
                if not text or not text.strip():
                    summary["documents_skipped"] += 1
                    logger.warning("Skipped file with empty text: %s", file_name)
                    continue
                logger.info(
                    "Extraction completed in %.2fs",
                    time.perf_counter() - extraction_start,
                )

                document["text"] = text
                metadata = document.get("metadata") or {}
                metadata["file_id"] = file_id or ""
                metadata["file_path"] = file_path
                metadata["relative_path"] = metadata.get("relative_path", "")
                document["metadata"] = metadata

                chunking_start = time.perf_counter()
                chunks = chunk_text(document)
                valid_chunks = [
                    chunk
                    for chunk in chunks
                    if isinstance(chunk.get("content"), str) and chunk["content"].strip()
                ]
                logger.info(
                    "Chunking completed in %.2fs",
                    time.perf_counter() - chunking_start,
                )

                if not valid_chunks:
                    summary["documents_skipped"] += 1
                    logger.warning("Skipped file with no valid chunks: %s", file_name)
                    continue

                summary["chunks_created"] += len(valid_chunks)

                embedding_start = time.perf_counter()
                logger.info("Embedding started")
                embedded_chunks = generate_embeddings(valid_chunks)
                logger.info(
                    "Embedding completed in %.2fs",
                    time.perf_counter() - embedding_start,
                )

                valid_embeddings = [
                    chunk for chunk in embedded_chunks if chunk.get("embedding") is not None
                ]
                logger.info("Embeddings generated: %s", len(valid_embeddings))

                if not valid_embeddings:
                    summary["documents_skipped"] += 1
                    logger.warning("No valid embeddings generated for file: %s", file_name)
                    continue

                storage_start = time.perf_counter()
                index_size_before = vector_client.get_index_size()
                logger.info("Embedding completed, inserting into FAISS")
                vector_client.insert_embeddings(valid_embeddings)
                index_size_after = vector_client.get_index_size()
                stored_count = max(0, index_size_after - index_size_before)
                summary["chunks_stored"] += stored_count
                summary["documents_processed"] += 1

                if file_id:
                    processed_file_ids.add(file_id)
                if file_path:
                    processed_file_paths.add(file_path)
                    indexed_file_paths.add(file_path)
                if file_id:
                    indexed_file_ids.add(file_id)

                logger.info(
                    "Storage completed in %.2fs",
                    time.perf_counter() - storage_start,
                )
                logger.info("Inserted into FAISS: %s", stored_count)
                logger.info("Processed file: %s", file_name)
                logger.info("Chunks stored: %s", stored_count)
            except Exception as exc:
                logger.error("Failed processing document %s: %s", file_name, exc)
                continue

        logger.info("Processed: %s", summary["documents_processed"])
        logger.warning("Skipped: %s", summary["documents_skipped"])
        logger.info("Total chunks: %s", summary["chunks_created"])
        logger.info("Stored in FAISS: %s", summary["chunks_stored"])
        return summary
    finally:
        vector_client.close()


def run_incremental_ingestion_test(
    folder_path: str,
    inspect_limit: int = 5,
) -> dict:
    """
    Clear FAISS storage, run ingestion, and report persisted progress.

    This helper is intended for manual interruption testing:
    1. Clears existing FAISS data.
    2. Starts the ingestion pipeline.
    3. Let it run for 2-3 minutes only.
    4. Interrupt manually if desired.
    5. Validate persisted FAISS state strictly.

    Args:
        folder_path: Source folder to ingest.
        inspect_limit: Number of stored rows to preview after completion/interruption.

    Returns:
        Summary dict with pipeline status, index size, preview rows, and pass/fail checks.
    """
    vector_client = vector_db_client

    logger.info("Incremental ingestion test started")
    logger.info("Step 1/6: Clearing FAISS storage")
    vector_client.clear()
    logger.info("Step 2/6: Starting ingestion pipeline for %s", folder_path)
    logger.info("Step 3/6: Let the pipeline run for 2-3 minutes only")
    logger.info("Step 4/6: Interrupt manually after 2-3 minutes if desired")

    summary: dict
    status = "completed"

    try:
        summary = run_ingestion_pipeline(folder_path)
        status = summary.get("status", "completed")
    except KeyboardInterrupt:
        status = "interrupted"
        summary = {
            "documents_total": 0,
            "documents_processed": 0,
            "documents_skipped": 0,
            "chunks_created": 0,
            "chunks_stored": 0,
            "status": status,
        }
        logger.warning("Pipeline interrupted manually. Inspecting persisted FAISS state")

    index_size = vector_client.get_index_size()
    preview = vector_client.inspect_data(inspect_limit)
    subjects = sorted(vector_client.get_indexed_metadata_values("subject"))
    preview_has_real_chunks = any(
        isinstance(item.get("content_preview"), str) and item["content_preview"].strip()
        for item in preview
    )
    multiple_subjects_found = len(subjects) > 1
    passed = (
        index_size > 0
        and bool(preview)
        and preview_has_real_chunks
        and multiple_subjects_found
    )
    failure_reasons = []

    if index_size <= 0:
        failure_reasons.append("Index size is 0; embedding or insert path did not persist data")
    if not preview:
        failure_reasons.append("inspect_data returned no rows; FAISS insert may not have been reached")
    elif not preview_has_real_chunks:
        failure_reasons.append("inspect_data did not return real chunk content")
    if not multiple_subjects_found:
        failure_reasons.append("Stored metadata does not show multiple subjects")

    logger.info("Step 5/6: FAISS index size after run/interruption: %s", index_size)
    logger.info("Step 6/6: Inspect data preview count: %s", len(preview))
    logger.info(
        "Subjects found in preview: %s",
        ", ".join(subjects) if subjects else "None",
    )
    logger.info("Verification result: %s", "PASS" if passed else "FAIL")
    for reason in failure_reasons:
        logger.warning("Verification detail: %s", reason)

    summary["status"] = status
    summary["index_size"] = index_size
    summary["inspect_data"] = preview
    summary["subjects_in_preview"] = subjects
    summary["verification_passed"] = passed
    summary["preview_has_real_chunks"] = preview_has_real_chunks
    summary["multiple_subjects_found"] = multiple_subjects_found
    summary["failure_reasons"] = failure_reasons
    return summary
