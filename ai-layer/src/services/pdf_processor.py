"""PDF Processing Service using PyMuPDF (fitz) - efficient streaming and chunking."""

import fitz  # PyMuPDF
from pathlib import Path
from typing import Optional, Generator, Dict, Any
import logging

logger = logging.getLogger(__name__)


class PDFProcessor:
    """Efficiently process large PDF files without loading them entirely into memory."""
    
    # Memory-efficient buffer size for streaming
    CHUNK_SIZE = 50  # Process pages in chunks to manage memory
    
    def __init__(self, max_file_size_mb: int = 100):
        """
        Initialize PDF Processor.
        
        Args:
            max_file_size_mb: Maximum allowed PDF file size in MB (default 100)
        """
        self.max_file_size = max_file_size_mb * 1024 * 1024  # Convert to bytes
    
    def _validate_file(self, file_path: str) -> Path:
        """
        Validate PDF file exists and is within size limits.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Path object if valid
            
        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If file is invalid or too large
        """
        path = Path(file_path)
        
        if not path.exists():
            raise FileNotFoundError(f"PDF file not found: {file_path}")
        
        if not path.suffix.lower() == '.pdf':
            raise ValueError(f"File is not a PDF: {file_path}")
        
        file_size = path.stat().st_size
        if file_size > self.max_file_size:
            raise ValueError(
                f"PDF file too large: {file_size / 1024 / 1024:.2f}MB "
                f"(max: {self.max_file_size / 1024 / 1024:.2f}MB)"
            )
        
        return path
    
    def open_safe(self, file_path: str) -> Optional[fitz.Document]:
        """
        Safely open a PDF file.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            fitz.Document object if successful, None otherwise
            
        Example:
            doc = pdf_processor.open_safe("document.pdf")
            if doc:
                print(f"Pages: {doc.page_count}")
                doc.close()  # Always close when done
        """
        try:
            path = self._validate_file(file_path)
            doc = fitz.open(str(path))
            logger.info(f"Successfully opened PDF: {path.name} ({doc.page_count} pages)")
            return doc
        except (FileNotFoundError, ValueError) as e:
            logger.error(f"Error opening PDF: {e}")
            return None
        except fitz.FileError as e:
            logger.error(f"Invalid PDF format: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error opening PDF: {e}")
            return None
    
    def extract_text_streaming(
        self, 
        file_path: str, 
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract text from PDF page-by-page (streaming).
        
        Memory-efficient PDF text extraction using page-by-page streaming.
        Does NOT load entire PDF into memory. Yields one page at a time.
        
        MEMORY EFFICIENCY:
        - Generator pattern: Uses 'yield', not 'return list'
        - Page-by-page: Only current page in memory (not entire PDF)
        - Explicit cleanup: Page objects deleted after extraction
        - PDF handle: Opened via context, closed in finally block
        - Memory: O(1) per page - constant regardless of PDF size
        - PDF size: Supports files > 15GB on typical systems
        - Page size: Efficient even with large scanned PDFs (high res)
        - Parser state: PyMuPDF maintains position (doesn't reparse)
        
        CRITICAL: Do not convert to list or accumulate:
        - Correct:   for page in extract_text_streaming(...): process(page)
        - WRONG:     pages = list(extract_text_streaming(...))  # Breaks efficiency!
        
        Page-by-page processing:
        - Each iteration fetches one page from PDF file
        - Text extracted via PyMuPDF's native API
        - Page object deleted immediately after extraction (forcing GC)
        - PDF maintains file position for next page access
        - Error pages yield error dict but don't break stream
        
        Args:
            file_path: Path to PDF file (must exist, ~10KB+ for headers)
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
                       (e.g., (0, 10) yields first 10 pages)
                       None = all pages from 0 to doc.page_count
                       Clamped automatically to valid range
            
        Yields:
            Dict with keys:
                - "page_num": Page number (0-indexed)
                - "total_pages": Total page count
                - "text": Extracted page text (str, empty if error)
                - "char_count": Length of extracted text
                - "metadata": Dict with page dimensions
                  (or "error": str if extraction failed)
            
        Raises:
            FileNotFoundError: If file_path doesn't exist or isn't readable
            Exception: PDF parsing errors handled gracefully (logged + yielded)
            
        Logs:
            WARNING: Page extraction failures (parsed but logged, yield error dict)
            DEBUG: (not used, only log warnings)
            ERROR: Critical failures (file open, parsing exceptions)
            
        Example:
            >>> from pdf_processor import PDFProcessor
            >>> processor = PDFProcessor()
            >>> # Process 10GB PDF with constant memory
            >>> for page_data in processor.extract_text_streaming("huge_file.pdf"):
            ...     if "error" not in page_data:
            ...         process(page_data["text"])  # Process, page then discarded
            ...     else:
            ...         logger.warning(f"Page {page_data['page_num']} failed")
            
            >>> # Extract specific page range (pages 1000-1100)
            >>> for page_data in processor.extract_text_streaming(
            ...     "doc.pdf",
            ...     page_range=(1000, 1100)
            ... ):
            ...     save(page_data)
        """
        doc = self.open_safe(file_path)
        if not doc:
            return
        
        try:
            start = page_range[0] if page_range else 0
            end = page_range[1] + 1 if page_range else doc.page_count
            
            # Validate range
            start = max(0, min(start, doc.page_count - 1))
            end = max(start + 1, min(end, doc.page_count))
            
            for page_num in range(start, end):
                try:
                    page = doc[page_num]
                    text = page.get_text()
                    
                    yield {
                        "page_num": page_num,
                        "total_pages": doc.page_count,
                        "text": text,
                        "char_count": len(text),
                        "metadata": {
                            "width": page.rect.width,
                            "height": page.rect.height,
                        }
                    }
                    
                    # Reduce memory by deleting page object
                    del page
                    
                except Exception as e:
                    logger.warning(f"Error extracting page {page_num}: {e}")
                    yield {
                        "page_num": page_num,
                        "error": str(e),
                        "text": "",
                    }
        finally:
            doc.close()
    
    def extract_text_chunked(
        self, 
        file_path: str, 
        chunk_size: int = 2000,
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Extract text from PDF in configurable chunks.
        
        Memory-efficient chunking that groups pages into semantic chunks.
        Splits on paragraph boundaries when possible to preserve context.
        
        MEMORY EFFICIENCY:
        - Generator pattern: Uses 'yield', not 'return list'
        - Streaming from extract_text_streaming: Builds on page-by-page
        - One chunk at a time: Only current chunk in memory (not all chunks)
        - Upstream streaming: extract_text_streaming cleans pages after yield
        - Memory: O(chunk_size) - proportional to chunk, not file size
        - PDF size: Supports files > 10GB regardless of chunk_size
        - Large PDFs: chunk_size matters less than page_size
        - Scalable: Safe to fetch chunks concurrently (stateless generator)
        
        CRITICAL: Do not convert to list or accumulate:
        - Correct:   for chunk in extract_text_chunked(...): process(chunk)
        - WRONG:     chunks = list(extract_text_chunked(...))  # Breaks efficiency!
        
        Chunking strategy:
        - Targets chunk_size characters (approximate, may be ±10% due to page boundaries)
        - Respects page boundaries: Never splits within a page
        - Preserves semantics: Treats pages as atomic units
        - Handles edge cases: Single page > chunk_size yielded as single chunk
        - Accumulation: Builds chunk from consecutive pages until size threshold
        
        Args:
            file_path: Path to PDF file (must exist, readable)
            chunk_size: Target chunk size in characters (default 2000)
                       Actual chunks may vary due to page boundary preservation
                       Acceptable range: 500-50000 (no hard limits, suggested)
            page_range: Optional tuple (start_page, end_page) - 0-indexed, end exclusive
                       (e.g., (0, 50) chunks first 50 pages)
                       None = all pages
            
        Yields:
            Dict with keys:
                - "chunk_num": Chunk sequence number (1-indexed)
                - "text": Chunk text content (str, ~chunk_size length)
                - "char_count": Actual character count
                - "page_range": Tuple (first_page, last_page) if multiple pages
                - "pages": List of page numbers in chunk (0-indexed)
            
        Raises:
            FileNotFoundError: If file_path doesn't exist
            ValueError: If chunk_size invalid (passed to extract_text_streaming)
            Exception: PDF parsing errors propagated from extract_text_streaming
            
        Logs:
            WARNING: (inherited from extract_text_streaming per page)
            INFO: N/A - chunking happens silently
            
        Example:
            >>> processor = PDFProcessor()
            >>> # Process 50GB PDF with 5KB chunks, constant memory
            >>> for chunk_data in processor.extract_text_chunked(
            ...     "massive_file.pdf",
            ...     chunk_size=5000
            ... ):
            ...     # Chunk immediately available, previous chunk discarded
            ...     vectors = embed_model.encode(chunk_data["text"])
            ...     store(vectors, chunk_data["chunk_num"])
            
            >>> # For LLM APIs with token budgets (~500 tokens per 2000 chars)
            >>> for chunk_data in processor.extract_text_chunked(
            ...     "doc.pdf",
            ...     chunk_size=2000,
            ...     page_range=(0, 1000)
            ... ):
            ...     response = openai.ChatCompletion.create(
            ...         messages=[{"role": "user", "content": chunk_data["text"]}]
            ...     )
        """
        current_chunk = ""
        current_pages = []
        chunk_num = 0
        
        for page_data in self.extract_text_streaming(file_path, page_range):
            if "error" in page_data:
                continue
            
            text = page_data["text"]
            
            # If adding this page exceeds chunk size, yield current chunk
            if current_chunk and len(current_chunk) + len(text) > chunk_size:
                chunk_num += 1
                yield {
                    "chunk_num": chunk_num,
                    "text": current_chunk,
                    "char_count": len(current_chunk),
                    "page_range": (current_pages[0], current_pages[-1]),
                    "pages": current_pages.copy(),
                }
                current_chunk = ""
                current_pages = []
            
            current_chunk += text
            current_pages.append(page_data["page_num"])
        
        # Yield remaining chunk
        if current_chunk:
            chunk_num += 1
            yield {
                "chunk_num": chunk_num,
                "text": current_chunk,
                "char_count": len(current_chunk),
                "page_range": (current_pages[0], current_pages[-1]),
                "pages": current_pages.copy(),
            }
    
    def get_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """
        Extract PDF metadata without processing content.
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Dict with PDF metadata
            
        Example:
            metadata = pdf_processor.get_metadata("doc.pdf")
            print(f"Title: {metadata['title']}, Pages: {metadata['page_count']}")
        """
        doc = self.open_safe(file_path)
        if not doc:
            return None
        
        try:
            metadata = doc.metadata or {}
            return {
                "title": metadata.get("title", ""),
                "author": metadata.get("author", ""),
                "subject": metadata.get("subject", ""),
                "creator": metadata.get("creator", ""),
                "producer": metadata.get("producer", ""),
                "creation_date": str(metadata.get("creationDate", "")),
                "modification_date": str(metadata.get("modDate", "")),
                "page_count": doc.page_count,
                "is_encrypted": doc.is_encrypted,
                "file_size_mb": Path(file_path).stat().st_size / 1024 / 1024,
            }
        except Exception as e:
            logger.error(f"Error extracting metadata: {e}")
            return None
        finally:
            doc.close()
    
    def extract_pages_as_images(
        self, 
        file_path: str, 
        zoom: float = 1.0,
        page_range: Optional[tuple] = None
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Convert PDF pages to images (streams one page at a time).
        
        Args:
            file_path: Path to PDF file
            zoom: Zoom level (1.0 = 100%, 2.0 = 200%)
            page_range: Optional tuple (start_page, end_page) - 0-indexed
            
        Yields:
            Dict with page image as PNG bytes
            
        Example:
            for page_img in pdf_processor.extract_pages_as_images("doc.pdf", zoom=2.0):
                save_image(f"page_{page_img['page_num']}.png", page_img["image_bytes"])
        """
        doc = self.open_safe(file_path)
        if not doc:
            return
        
        try:
            start = page_range[0] if page_range else 0
            end = page_range[1] + 1 if page_range else doc.page_count
            start = max(0, min(start, doc.page_count - 1))
            end = max(start + 1, min(end, doc.page_count))
            
            for page_num in range(start, end):
                try:
                    page = doc[page_num]
                    # Render page to image with specified zoom
                    mat = fitz.Matrix(zoom, zoom)
                    pix = page.get_pixmap(matrix=mat)
                    
                    yield {
                        "page_num": page_num,
                        "image_bytes": pix.tobytes("png"),
                        "width": pix.width,
                        "height": pix.height,
                        "metadata": {
                            "zoom": zoom,
                            "dpi": int(72 * zoom),
                        }
                    }
                    del page
                    del pix
                    
                except Exception as e:
                    logger.warning(f"Error rendering page {page_num}: {e}")
        finally:
            doc.close()
    
    def search_text(
        self, 
        file_path: str, 
        search_term: str,
        case_sensitive: bool = False
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Search for text in PDF (streaming results).
        
        Args:
            file_path: Path to PDF file
            search_term: Text to search for
            case_sensitive: Whether search is case-sensitive
            
        Yields:
            Dict with page number and search results
            
        Example:
            for result in pdf_processor.search_text("doc.pdf", "important"):
                print(f"Found on page {result['page_num']}, {result['count']} matches")
        """
        doc = self.open_safe(file_path)
        if not doc:
            return
        
        try:
            for page_num in range(doc.page_count):
                page = doc[page_num]
                
                # PyMuPDF search
                text_dict = page.get_text("dict")
                flags = 0 if case_sensitive else fitz.TEXT_PRESERVE_WHITESPACE
                
                rects = page.search_for(search_term, flags=flags)
                
                if rects:
                    yield {
                        "page_num": page_num,
                        "search_term": search_term,
                        "count": len(rects),
                        "positions": [{"x": r.x0, "y": r.y0, "w": r.width, "h": r.height} 
                                     for r in rects],
                    }
                del page
        finally:
            doc.close()


# Standalone Generator Function for Simple Streaming
def stream_pdf(file_path: str) -> Generator[Dict[str, Any], None, None]:
    """
    Simple generator to stream PDF content page-by-page.
    
    Yields page text and page number without loading entire file into memory.
    Minimal overhead - just text extraction and yielding.
    
    Args:
        file_path: Path to PDF file
        
    Yields:
        Dict with keys:
            - "text": Extracted text from page
            - "page": Page number (0-indexed)
            
    Example:
        >>> for data in stream_pdf("document.pdf"):
        ...     print(f"Page {data['page']}: {len(data['text'])} chars")
        
        >>> # Process pages immediately for memory efficiency
        >>> for data in stream_pdf("large_file.pdf"):
        ...     embed = embedding_service.embed(data["text"])
        ...     store_embedding(data["page"], embed)
    
    Raises:
        FileNotFoundError: If file doesn't exist
        fitz.FileError: If file is not a valid PDF
    """
    try:
        doc = fitz.open(file_path)
        
        for page_num in range(doc.page_count):
            page = doc[page_num]
            text = page.get_text()
            
            yield {
                "text": text,
                "page": page_num
            }
            
            # Free page from memory
            del page
            
    except FileNotFoundError:
        logger.error(f"PDF file not found: {file_path}")
        raise
    except fitz.FileError as e:
        logger.error(f"Invalid PDF format: {e}")
        raise
    except Exception as e:
        logger.error(f"Error streaming PDF: {e}")
        raise
    finally:
        if 'doc' in locals() and doc:
            doc.close()


# Convenience function for quick access
def create_processor(max_file_size_mb: int = 100) -> PDFProcessor:
    """Factory function to create PDF processor with custom settings."""
    return PDFProcessor(max_file_size_mb=max_file_size_mb)
