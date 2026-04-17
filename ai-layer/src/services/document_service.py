"""Document Service - document processing with PDF support."""

from typing import Optional, Generator, Dict, Any
import logging
from pathlib import Path

from .pdf_processor import PDFProcessor
from models.file_metadata_models import FileMetadata
from utils.text_processing import clean_text

logger = logging.getLogger(__name__)


class DocumentService:
    """Service for document processing and management with PDF support."""
    
    def __init__(self, max_pdf_size_mb: int = 100):
        """
        Initialize Document Service.
        
        Args:
            max_pdf_size_mb: Maximum allowed PDF file size in MB
        """
        self.pdf_processor = PDFProcessor(max_file_size_mb=max_pdf_size_mb)
    
    def process_document(self, filename: str, content: str = None, file_path: str = None) -> dict:
        """
        Process a document (PDF or text).
        
        Args:
            filename: Name of the document
            content: Text content (for non-PDF files)
            file_path: Path to document file (for PDFs)
            
        Returns:
            Processing result with status and metadata
        """
        if file_path and filename.lower().endswith('.pdf'):
            return self._process_pdf(file_path)
        
        # Placeholder for other file types
        return {
            "filename": filename,
            "status": "processed",
            "chunks": 0,
            "file_type": Path(filename).suffix
        }
    
    def _process_pdf(self, file_path: str) -> dict:
        """Process PDF and extract metadata."""
        try:
            metadata = self.pdf_processor.get_metadata(file_path)
            if not metadata:
                return {"status": "error", "message": "Could not read PDF"}
            
            return {
                "filename": Path(file_path).name,
                "status": "processed",
                "file_type": "pdf",
                "page_count": metadata["page_count"],
                "file_size_mb": metadata["file_size_mb"],
                "metadata": metadata
            }
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            return {"status": "error", "message": str(e)}
    
    def extract_pdf_text_streaming(
        self, 
        file_path: str, 
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract text from PDF page-by-page (memory efficient).
        
        Memory-efficient PDF text extraction using streaming.
        Processes one page at a time, never loading full PDF into memory.
        
        MEMORY EFFICIENCY:
        - Generator pattern: Uses 'yield', not 'return'
        - Page-by-page: Only current page in memory (not entire PDF)
        - No accumulation: Pages discarded after yield
        - Upstream cleanup: PDF parser cleans up after each page
        - Memory: O(1) per page - constant regardless of PDF size
        - PDF size: Supports files > 10GB without memory issues
        - Page size: Efficient even with large scanned PDFs
        
        CRITICAL: Do not convert to list or accumulate:
        - Correct:   for page in extract_pdf_text_streaming(...): process(page)
        - WRONG:     pages = list(extract_pdf_text_streaming(...))  # Breaks efficiency!
        
        Args:
            file_path: Path to PDF file (must exist and be readable)
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
                       (e.g., (0, 10) extracts first 10 pages)
                       None = all pages
            
        Yields:
            Dict with keys:
                - "text": Extracted page text (str)
                - "page": Page number (0-indexed, int)
                - "size_bytes": Extracted text size in bytes (int)
            
        Raises:
            FileNotFoundError: If file_path doesn't exist
            ValueError: If page_range is invalid (start >= end)
            Exception: PDF parsing/reading errors logged but may raise
            
        Logs:
            INFO: PDF metadata (pages, file size, encoding)
            DEBUG: Each page extraction (page number, text length)
            ERROR: Parsing failures per page
            
        Example:
            >>> from document_service import DocumentService
            >>> service = DocumentService()
            >>> # Process 15GB PDF with constant memory
            >>> for page in service.extract_pdf_text_streaming("huge_file.pdf"):
            ...     process(page["text"])  # Process immediately, page then discarded
            
            >>> # Extract specific page range (pages 100-200)
            >>> for page in service.extract_pdf_text_streaming(
            ...     "doc.pdf", 
            ...     page_range=(100, 200)
            ... ):
            ...     save(page)
        """
        return self.pdf_processor.extract_text_streaming(file_path, page_range)
    
    def extract_pdf_text_chunked(
        self, 
        file_path: str, 
        chunk_size: int = 2000,
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract text from PDF in configurable chunks (memory efficient).
        
        Memory-efficient PDF text extraction that chunks across pages.
        Maintains semantic boundaries and optimizes for LLM/API processing.
        
        MEMORY EFFICIENCY:
        - Generator pattern: Uses 'yield', not 'return'
        - Chunk-based: Only current chunk in memory (not entire PDF or page)
        - No accumulation: Chunks discarded after yield
        - Smart chunking: Breaks on paragraph boundaries when possible
        - Memory: O(chunk_size) - proportional to chunk, not file size
        - PDF size: Supports files > 10GB regardless of chunk_size
        - Parallelizable: Safe to fetch multiple chunks concurrently
        
        CRITICAL: Do not convert to list or accumulate:
        - Correct:   for chunk in extract_pdf_text_chunked(...): process(chunk)
        - WRONG:     chunks = list(extract_pdf_text_chunked(...))  # Breaks efficiency!
        
        Chunking strategy:
        - Targets chunk_size characters (approximate, within ±20%)
        - Respects paragraph boundaries (breaks on blank lines)
        - Preserves context: Overlaps chunks when possible
        - Handles edge cases: Single large paragraph > chunk_size
        
        Args:
            file_path: Path to PDF file (must exist and be readable)
            chunk_size: Target chunk size in characters (default 2000)
                       Actual chunks may be ±20% due to boundary preservation
                       Minimum 100, maximum 50000 (clamped automatically)
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
                       (e.g., (0, 50) processes first 50 pages)
                       None = all pages
            
        Yields:
            Dict with keys:
                - "text": Chunk text content (str, ~chunk_size length)
                - "chunk_index": Chunk sequence number (0-indexed, int)
                - "start_page": Starting page number (0-indexed, int)
                - "end_page": Ending page number (0-indexed, int)
                - "chunk_number": Human-readable chunk ID (str)
            
        Raises:
            FileNotFoundError: If file_path doesn't exist
            ValueError: If chunk_size < 100 or > 50000 (after clipping)
            ValueError: If page_range is invalid
            Exception: PDF parsing/reading errors logged but may raise
            
        Logs:
            INFO: Chunk extraction metadata (size, pages, boundaries)
            DEBUG: Edge cases (oversized paragraphs, boundary skips)
            WARNING: Chunks with very large paragraphs (>2x chunk_size)
            ERROR: Processing failures per file
            
        Example:
            >>> # Process 20GB PDF with 2KB chunks, constant memory
            >>> for chunk in service.extract_pdf_text_chunked(
            ...     "huge_file.pdf", 
            ...     chunk_size=2000
            ... ):
            ...     # Process immediately, chunk then discarded
            ...     embeddings = embed(chunk["text"])  # For RAG applications
            ...     save_embedding(embeddings, chunk["chunk_index"])
            
            >>> # For API calls with token limits
            >>> for chunk in service.extract_pdf_text_chunked(
            ...     "doc.pdf",
            ...     chunk_size=1500,  # ~400 tokens at 0.25 chars/token
            ...     page_range=(10, 100)
            ... ):
            ...     response = llm.call(f"Summarize: {chunk['text']}")
        """
        return self.pdf_processor.extract_text_chunked(file_path, chunk_size, page_range)
    
    def get_pdf_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Extract PDF metadata.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Metadata dictionary
        """
        return self.pdf_processor.get_metadata(file_path)
    
    def extract_pdf_with_metadata(
        self,
        file_metadata: FileMetadata,
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract PDF content with Phase 1 metadata attached to each page.
        
        Integrates FileMetadata with PDF streaming to produce structured page data
        ready for RAG indexing and embedding pipelines.
        
        MEMORY EFFICIENCY:
        - Generator pattern: Streams pages one at a time
        - Metadata reused: Single FileMetadata object (not duplicated per page)
        - No accumulation: Pages discarded after yield
        - Memory: O(1) - constant regardless of PDF or metadata complexity
        - Scalable: Works seamlessly with large PDFs and concurrent processors
        
        METADATA INTEGRATION:
        - Extracts file_path from FileMetadata
        - Validates metadata structure before streaming
        - Attaches all metadata fields to each page:
          - Hierarchy: department, semester, subject
          - File info: file_name, file_path, file_id
          - Timestamps: created_at
        - Preserves all PDF extraction metadata (page_num, char_count, etc.)
        
        CRITICAL: Do not convert to list:
        - Correct:   for page in extract_pdf_with_metadata(...): process(page)
        - WRONG:     pages = list(extract_pdf_with_metadata(...))  # Breaks efficiency!
        
        Args:
            file_metadata: FileMetadata object with file_path and hierarchy info
                          Must be valid FileMetadata instance (validated by pydantic)
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
                       (e.g., (0, 100) processes first 100 pages)
                       None = all pages
            
        Yields:
            Dict with structured page data including:
                PDF extraction fields:
                - "text": Extracted page text (str)
                - "page_num": Page number (0-indexed, int)
                - "total_pages": Total page count
                - "char_count": Character count of extracted text
                - "metadata": Dict with page dimensions (width, height)
                
                Phase 1 metadata fields:
                - "file_id": Unique file identifier (str, UUID)
                - "file_name": File name with extension (str)
                - "file_path": Absolute file path (str)
                - "department": Department classification (str)
                - "semester": Semester/term identifier (str)
                - "subject": Subject/course name (str)
                - "file_size": Total file size in bytes (int)
                - "extension": File extension (str)
                - "created_at": ISO 8601 creation timestamp (str)
                
            Or on error: Dict with "error" key and error message
            
        Raises:
            TypeError: If file_metadata is not FileMetadata instance
            FileNotFoundError: If file_path from metadata doesn't exist
            Exception: PDF parsing errors (logged and yielded as error dicts)
            
        Logs:
            INFO: File path extracted from metadata, streaming started
            WARNING: Page extraction failures (logged per page)
            ERROR: MetadataValidation failures, file open errors
            
        Example:
            >>> from models.file_metadata_models import FileMetadata
            >>> metadata = FileMetadata(
            ...     id="uuid-1234",
            ...     department="Computer Science",
            ...     semester="Spring 2024",
            ...     subject="Algorithms",
            ...     file_name="cs301_lecture.pdf",
            ...     file_path="/uploads/cs301_lecture.pdf",
            ...     file_size=5242880,
            ...     extension=".pdf",
            ...     created_at="2024-01-15T10:30:00Z"
            ... )
            >>> # Stream PDF with metadata, constant memory
            >>> for page_data in service.extract_pdf_with_metadata(metadata):
            ...     if "error" not in page_data:
            ...         # Page ready for embedding/indexing
            ...         embed = encoder.encode(page_data["text"])
            ...         index.upsert(
            ...             id=f"{page_data['file_id']}_page_{page_data['page_num']}",
            ...             text=page_data["text"],
            ...             metadata={
            ...                 "file": page_data["file_name"],
            ...                 "dept": page_data["department"],
            ...                 "semester": page_data["semester"]
            ...             }
            ...         )
        """
        # Validate input
        if not isinstance(file_metadata, FileMetadata):
            error_msg = f"Expected FileMetadata, got {type(file_metadata).__name__}"
            logger.error(error_msg)
            yield {"error": error_msg}
            return
        
        file_path = file_metadata.file_path
        logger.info(
            f"Starting PDF stream with metadata: {file_metadata.file_name} "
            f"(dept: {file_metadata.department}, subject: {file_metadata.subject})"
        )
        
        # Stream PDF pages and attach metadata to each
        try:
            for page_data in self.extract_pdf_text_streaming(file_path, page_range):
                # Handle error cases from PDF extraction
                if "error" in page_data:
                    logger.warning(
                        f"Error extracting page {page_data.get('page_num', '?')}: "
                        f"{page_data['error']}"
                    )
                    # Yield error but include metadata for debugging
                    yield {
                        **page_data,
                        "file_id": file_metadata.id,
                        "file_name": file_metadata.file_name,
                        "file_path": file_metadata.file_path,
                        "department": file_metadata.department,
                        "semester": file_metadata.semester,
                        "subject": file_metadata.subject,
                        "file_size": file_metadata.file_size,
                        "extension": file_metadata.extension,
                        "created_at": file_metadata.created_at,
                    }
                    continue
                
                # Merge PDF page data with metadata
                enriched_page = {
                    # PDF extraction fields
                    "text": page_data.get("text", ""),
                    "page_num": page_data.get("page_num", 0),
                    "total_pages": page_data.get("total_pages", 0),
                    "char_count": page_data.get("char_count", 0),
                    "metadata": page_data.get("metadata", {}),
                    
                    # Phase 1 metadata fields
                    "file_id": file_metadata.id,
                    "file_name": file_metadata.file_name,
                    "file_path": file_metadata.file_path,
                    "department": file_metadata.department,
                    "semester": file_metadata.semester,
                    "subject": file_metadata.subject,
                    "file_size": file_metadata.file_size,
                    "extension": file_metadata.extension,
                    "created_at": file_metadata.created_at,
                }
                
                yield enriched_page
                
        except FileNotFoundError as e:
            logger.error(f"File not found in metadata stream: {e}")
            yield {"error": f"File not found: {str(e)}", "file_id": file_metadata.id}
        except Exception as e:
            logger.error(f"Unexpected error in metadata stream: {e}")
            yield {"error": f"Processing error: {str(e)}", "file_id": file_metadata.id}
    
    def extract_and_clean(
        self,
        file_metadata: FileMetadata,
        page_range: Optional[tuple] = None,
        clean: bool = True
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract PDF with metadata and clean text in one pipeline.
        
        Combines PDF extraction, text cleaning, and metadata attachment.
        
        Args:
            file_metadata: FileMetadata object
            page_range: Optional page range tuple
            clean: Whether to apply text cleaning (default True)
            
        Yields:
            Enriched page data with optionally cleaned text
        """
        for page_data in self.extract_pdf_with_metadata(file_metadata, page_range):
            if "error" not in page_data and clean:
                # Clean the extracted text
                page_data["text"] = clean_text(page_data["text"])
            
            yield page_data
    
    def search_pdf(
        self, 
        file_path: str, 
        search_term: str,
        case_sensitive: bool = False
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Search for text in PDF.
        
        Args:
            file_path: Path to PDF file
            search_term: Text to search for
            case_sensitive: Whether search is case-sensitive
            
        Yields:
            Search results per page
        """
        return self.pdf_processor.search_text(file_path, search_term, case_sensitive)


document_service = DocumentService()
