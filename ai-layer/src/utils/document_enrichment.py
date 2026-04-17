"""Document enrichment utilities - combine page text with file metadata."""

from typing import Dict, List, Optional, Any, Generator
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)


@dataclass
class DocumentMetadata:
    """Metadata for a document."""
    
    file_name: str
    department: str
    semester: str
    subject: str
    
    def to_dict(self) -> Dict[str, str]:
        """Convert metadata to dictionary."""
        return {
            "file_name": self.file_name,
            "department": self.department,
            "semester": self.semester,
            "subject": self.subject,
        }


@dataclass
class EnrichedPage:
    """Page data enriched with metadata."""
    
    text: str
    page: int
    department: str
    semester: str
    subject: str
    file_name: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "text": self.text,
            "page": self.page,
            "department": self.department,
            "semester": self.semester,
            "subject": self.subject,
            "file_name": self.file_name,
        }
    
    def __str__(self) -> str:
        """String representation."""
        return (
            f"Page {self.page} | {self.file_name} | "
            f"{self.department} | {self.semester} | {self.subject}"
        )


def enrich_page_data(
    text: str,
    page_number: int,
    file_name: str,
    department: str,
    semester: str,
    subject: str
) -> Dict[str, Any]:
    """
    Combine page text with file metadata into structured output.
    
    Creates a consistent, enriched document with metadata attached to each page.
    Useful for maintaining context when processing PDFs extracted from a collection.
    
    Args:
        text: Extracted page text
        page_number: Page number (0-indexed or 1-indexed)
        file_name: Name of the PDF file
        department: Department/category
        semester: Semester/term information
        subject: Subject/course name
        
    Returns:
        Dict with combined data in standard format
        
    Example:
        >>> enriched = enrich_page_data(
        ...     text="Course content...",
        ...     page_number=1,
        ...     file_name="CS101_Lecture.pdf",
        ...     department="Computer Science",
        ...     semester="Spring 2024",
        ...     subject="Fundamentals"
        ... )
        >>> enriched["page"]
        1
        >>> enriched["department"]
        'Computer Science'
    """
    return {
        "text": text,
        "page": page_number,
        "department": department,
        "semester": semester,
        "subject": subject,
        "file_name": file_name,
    }


def enrich_page_object(
    text: str,
    page_number: int,
    file_name: str,
    department: str,
    semester: str,
    subject: str
) -> EnrichedPage:
    """
    Create enriched page object with metadata.
    
    Uses dataclass for type safety and structured access.
    
    Args:
        text: Extracted page text
        page_number: Page number
        file_name: PDF file name
        department: Department/category
        semester: Semester/term
        subject: Subject/course
        
    Returns:
        EnrichedPage object with all metadata
        
    Example:
        >>> page = enrich_page_object(
        ...     text="...",
        ...     page_number=1,
        ...     file_name="lecture.pdf",
        ...     department="CS",
        ...     semester="S2024",
        ...     subject="AI"
        ... )
        >>> page.department
        'CS'
        >>> page.to_dict()
        {...}
    """
    return EnrichedPage(
        text=text,
        page=page_number,
        department=department,
        semester=semester,
        subject=subject,
        file_name=file_name,
    )


def enrich_page_stream(
    page_stream: Generator[Dict[str, Any], None, None],
    metadata: DocumentMetadata
) -> Generator[Dict[str, Any], None, None]:
    """
    Enrich a stream of pages with document metadata.
    
    Takes pages from stream_pdf() and adds metadata to each page.
    Maintains memory efficiency by processing page-by-page.
    
    MEMORY EFFICIENCY:
    - Generator pattern: Uses 'yield', not 'return'
    - One page at a time: Only current page in memory
    - Metadata reused: Single DocumentMetadata object shared (constant)
    - No accumulation: Pages discarded after yielding
    - Processing: Upstream page removed by garbage collection after yield
    - Memory: O(1) - constant regardless of file size
    - Supports: GB-scale PDFs without memory issues
    
    CRITICAL: Do not call list() on this generator - breaks memory efficiency:
    - Correct:   for page in enrich_page_stream(...): process(page)
    - WRONG:     pages = list(enrich_page_stream(...))  # Accumulates all!
    
    Args:
        page_stream: Generator yielding pages with "text" and "page" keys
                    (e.g., from stream_pdf() - MUST be generator, not list)
        metadata: DocumentMetadata with file information
        
    Yields:
        Enriched page dictionaries (immediately eligible for garbage collection)
        
    Example:
        >>> from src.services.pdf_processor import stream_pdf
        >>> meta = DocumentMetadata(
        ...     file_name="lecture.pdf",
        ...     department="CS",
        ...     semester="Spring 2024",
        ...     subject="Databases"
        ... )
        >>> # Process 5GB file with constant memory
        >>> for enriched in enrich_page_stream(stream_pdf("5gb_file.pdf"), meta):
        ...     save(enriched)  # Process immediately, page then discarded
    """
    for page_data in page_stream:
        # Create enriched page with metadata
        enriched_page = {
            "text": page_data.get("text", ""),
            "page": page_data.get("page", 0),
            "department": metadata.department,
            "semester": metadata.semester,
            "subject": metadata.subject,
            "file_name": metadata.file_name,
        }
        
        # Yield and pause execution here
        # Upstream page_data is eligible for garbage collection
        yield enriched_page
        
        # After yield, enriched_page becomes eligible for garbage collection
        # Next iteration fetches new upstream page - memory released


def enrich_page_batch(
    pages: List[Dict[str, Any]],
    file_name: str,
    department: str,
    semester: str,
    subject: str
) -> List[Dict[str, Any]]:
    """
    Enrich a batch of pages with metadata.
    
    Processes a list of pages (e.g., from split_text_by_paragraphs).
    Use when you have all pages in memory.
    
    Args:
        pages: List of page dicts with "text" and "page" keys
        file_name: PDF file name
        department: Department/category
        semester: Semester/term
        subject: Subject/course
        
    Returns:
        List of enriched page dictionaries
        
    Example:
        >>> pages = [
        ...     {"text": "Page 1 content", "page": 0},
        ...     {"text": "Page 2 content", "page": 1},
        ... ]
        >>> enriched = enrich_page_batch(
        ...     pages,
        ...     file_name="doc.pdf",
        ...     department="Eng",
        ...     semester="F2024",
        ...     subject="Python"
        ... )
    """
    enriched = []
    for page in pages:
        enriched_page = {
            "text": page.get("text", ""),
            "page": page.get("page", 0),
            "department": department,
            "semester": semester,
            "subject": subject,
            "file_name": file_name,
        }
        enriched.append(enriched_page)
    return enriched


def extract_metadata_from_filename(
    file_name: str,
    delimiter: str = "_"
) -> Optional[Dict[str, str]]:
    """
    Extract metadata from filename pattern.
    
    Parses filenames like "CS101_Spring2024_Lecture1.pdf"
    into structured metadata.
    
    Common patterns:
    - "DEPT_SEMESTER_SUBJECT_NAME.pdf"
    - "SUBJECT_SEMESTER_DESCRIPTION.pdf"
    - "COURSE_TERM_TOPIC.pdf"
    
    Args:
        file_name: PDF filename
        delimiter: Separator character (default "_")
        
    Returns:
        Dict with parsed metadata or None if pattern doesn't match
        
    Note:
        This is a best-effort parser. Structure depends on filename format.
        May need customization for specific naming conventions.
        
    Example:
        >>> meta = extract_metadata_from_filename("CS101_Spring2024_Databases.pdf")
        >>> meta["subject"]
        'Databases'
    """
    try:
        # Remove extension
        name = file_name.rsplit(".", 1)[0]
        
        # Split by delimiter
        parts = name.split(delimiter)
        
        if len(parts) >= 3:
            return {
                "department": parts[0],
                "semester": parts[1],
                "subject": parts[2],
                "file_name": file_name,
            }
        elif len(parts) == 2:
            return {
                "department": parts[0],
                "semester": parts[1],
                "subject": "",
                "file_name": file_name,
            }
        else:
            return None
    except Exception as e:
        logger.warning(f"Could not parse filename metadata: {e}")
        return None


def validate_enriched_page(page: Dict[str, Any]) -> bool:
    """
    Validate that enriched page has all required fields.
    
    Args:
        page: Page dictionary to validate
        
    Returns:
        True if valid, False otherwise
        
    Example:
        >>> page = {"text": "...", "page": 1, "department": "CS", ...}
        >>> validate_enriched_page(page)
        True
    """
    required_fields = {"text", "page", "department", "semester", "subject", "file_name"}
    return all(field in page for field in required_fields)


def validate_metadata(metadata: Dict[str, str]) -> bool:
    """
    Validate document metadata.
    
    Args:
        metadata: Metadata dictionary
        
    Returns:
        True if valid, False otherwise
    """
    required_fields = {"file_name", "department", "semester", "subject"}
    return all(field in metadata and metadata[field] for field in required_fields)


def merge_pages_with_metadata(
    pages: List[Dict[str, str]],
    metadata: Dict[str, str]
) -> List[Dict[str, Any]]:
    """
    Merge a list of pages with metadata.
    
    Helper function to combine pages dictionary with metadata dictionary.
    
    Args:
        pages: List of pages with "text" and "page" keys
        metadata: Metadata dict with "file_name", "department", "semester", "subject"
        
    Returns:
        List of merged page/metadata dictionaries
        
    Raises:
        ValueError: If metadata missing required fields
    """
    if not validate_metadata(metadata):
        raise ValueError("Metadata missing required fields")
    
    merged = []
    for page in pages:
        merged_page = {
            **page,
            **metadata,
        }
        merged.append(merged_page)
    
    return merged


def group_pages_by_metadata(
    pages: List[Dict[str, Any]]
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Group enriched pages by metadata field.
    
    Useful for organizing or filtering pages by department, semester, etc.
    
    Args:
        pages: List of enriched pages (with metadata)
        
    Returns:
        Dict mapping metadata value to list of pages
        
    Example:
        >>> pages = [
        ...     {"text": "...", "department": "CS", ...},
        ...     {"text": "...", "department": "CS", ...},
        ...     {"text": "...", "department": "Math", ...},
        ... ]
        >>> by_dept = group_pages_by_metadata(pages)
        >>> len(by_dept["CS"])
        2
    """
    grouped = {}
    for page in pages:
        # Group by file_name and department
        key = f"{page.get('file_name', 'unknown')} - {page.get('department', 'unknown')}"
        if key not in grouped:
            grouped[key] = []
        grouped[key].append(page)
    
    return grouped


def get_document_summary(pages: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate summary statistics for a collection of enriched pages.
    
    Args:
        pages: List of enriched pages
        
    Returns:
        Summary with page count, metadata, etc.
        
    Example:
        >>> summary = get_document_summary(enriched_pages)
        >>> summary["total_pages"]
        10
        >>> summary["department"]
        'Computer Science'
    """
    if not pages:
        return {}
    
    first_page = pages[0]
    
    summary = {
        "total_pages": len(pages),
        "file_name": first_page.get("file_name", "unknown"),
        "department": first_page.get("department", "unknown"),
        "semester": first_page.get("semester", "unknown"),
        "subject": first_page.get("subject", "unknown"),
        "total_characters": sum(len(page.get("text", "")) for page in pages),
        "avg_characters_per_page": sum(
            len(page.get("text", "")) for page in pages
        ) / len(pages) if pages else 0,
    }
    
    return summary


def create_document_collection(
    documents: List[Dict[str, Any]]
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Create organized collection of enriched documents.
    
    Args:
        documents: List of dicts with "pages", "metadata"
                  Example: [{"pages": [...], "metadata": {...}}, ...]
        
    Returns:
        Organized collection by file
    """
    collection = {}
    for doc in documents:
        file_name = doc.get("metadata", {}).get("file_name", "unknown")
        collection[file_name] = doc.get("pages", [])
    
    return collection


# Page Filtering Functions

def is_page_empty(text: str) -> bool:
    """
    Check if page text is empty or only whitespace.
    
    Args:
        text: Page text to check
        
    Returns:
        True if page is empty/whitespace only, False otherwise
        
    Example:
        >>> is_page_empty("")
        True
        >>> is_page_empty("   \\n\\t  ")
        True
        >>> is_page_empty("Content")
        False
    """
    return not text or not text.strip()


def is_page_valid(
    text: str,
    min_characters: int = 10,
    ignore_whitespace: bool = True
) -> bool:
    """
    Check if page has meaningful content.
    
    Validates that page has sufficient non-whitespace characters and isn't just
    formatting or empty space.
    
    Args:
        text: Page text to validate
        min_characters: Minimum characters required (default 10)
        ignore_whitespace: Count only non-whitespace characters (default True)
        
    Returns:
        True if page has meaningful content, False otherwise
        
    Example:
        >>> is_page_valid("Valid content here")
        True
        >>> is_page_valid("   ")
        False
        >>> is_page_valid("Hi", min_characters=5)
        False
    """
    if not text:
        return False
    
    if ignore_whitespace:
        content_length = len(text.strip())
    else:
        content_length = len(text)
    
    return content_length >= min_characters


def filter_pages(
    pages: List[Dict[str, str]],
    min_characters: int = 10,
    skip_empty: bool = True,
    file_name: str = "unknown"
) -> tuple[List[Dict[str, str]], Dict[str, Any]]:
    """
    Filter out invalid or empty pages from a list.
    
    Removes pages with no meaningful text and logs skip statistics.
    
    Args:
        pages: List of page dicts with "text" and "page" keys
        min_characters: Minimum characters for valid page (default 10)
        skip_empty: Skip pages with only whitespace (default True)
        file_name: File name for logging purposes
        
    Returns:
        Tuple of (filtered_pages, skip_stats) where skip_stats contains:
        - total_pages: Total pages processed
        - skipped_pages: Number of pages skipped
        - skipped_indices: Page numbers that were skipped
        - valid_pages: Number of valid pages
        
    Example:
        >>> pages = [
        ...     {"text": "Valid content", "page": 1},
        ...     {"text": "   ", "page": 2},
        ...     {"text": "", "page": 3},
        ... ]
        >>> valid, stats = filter_pages(pages)
        >>> len(valid)
        1
        >>> stats["skipped_pages"]
        2
    """
    filtered = []
    skipped_indices = []
    
    for page in pages:
        text = page.get("text", "")
        page_num = page.get("page", 0)
        
        # Check if page is valid
        if not is_page_valid(text, min_characters=min_characters):
            skipped_indices.append(page_num)
            reason = "empty/whitespace" if is_page_empty(text) else "insufficient content"
            logger.warning(
                f"Skipping page {page_num} in {file_name}: {reason} "
                f"(length: {len(text.strip())} chars)"
            )
            continue
        
        filtered.append(page)
    
    skip_stats = {
        "total_pages": len(pages),
        "skipped_pages": len(skipped_indices),
        "skipped_indices": skipped_indices,
        "valid_pages": len(filtered),
        "skip_rate": round(len(skipped_indices) / len(pages) * 100, 1) if pages else 0,
    }
    
    if skipped_indices:
        logger.info(
            f"Filtered {file_name}: {len(filtered)}/{len(pages)} valid pages "
            f"({skip_stats['skip_rate']}% skipped)"
        )
    
    return filtered, skip_stats


def filter_enriched_pages(
    pages: List[Dict[str, Any]],
    min_characters: int = 10,
    file_name: str = "unknown"
) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Filter enriched pages (with metadata) keeping only valid ones.
    
    Similar to filter_pages but works with enriched pages that have metadata.
    
    Args:
        pages: List of enriched page dicts with "text", "page", and metadata
        min_characters: Minimum characters for valid page
        file_name: File name for logging
        
    Returns:
        Tuple of (filtered_pages, skip_stats)
        
    Example:
        >>> pages = [
        ...     {"text": "Content", "page": 1, "department": "CS", ...},
        ...     {"text": "   ", "page": 2, "department": "CS", ...},
        ... ]
        >>> valid, stats = filter_enriched_pages(pages)
        >>> len(valid)
        1
    """
    filtered = []
    skipped_indices = []
    
    for page in pages:
        text = page.get("text", "")
        page_num = page.get("page", 0)
        
        # Check if page is valid
        if not is_page_valid(text, min_characters=min_characters):
            skipped_indices.append(page_num)
            reason = "empty/whitespace" if is_page_empty(text) else "insufficient content"
            logger.warning(
                f"Skipping enriched page {page_num} in {file_name}: {reason} "
                f"(length: {len(text.strip())} chars)"
            )
            continue
        
        filtered.append(page)
    
    skip_stats = {
        "total_pages": len(pages),
        "skipped_pages": len(skipped_indices),
        "skipped_indices": skipped_indices,
        "valid_pages": len(filtered),
        "skip_rate": round(len(skipped_indices) / len(pages) * 100, 1) if pages else 0,
    }
    
    if skipped_indices:
        logger.info(
            f"Filtered enriched pages from {file_name}: {len(filtered)}/{len(pages)} valid "
            f"({skip_stats['skip_rate']}% skipped)"
        )
    
    return filtered, skip_stats


def filter_page_stream(
    page_stream: Generator[Dict[str, Any], None, None],
    min_characters: int = 10,
    file_name: str = "unknown"
) -> Generator[Dict[str, Any], None, None]:
    """
    Filter pages from a stream, skipping invalid/empty pages.
    
    Memory-efficient stream filtering that processes one page at a time.
    
    MEMORY EFFICIENCY:
    - Generator pattern: Uses 'yield', not 'return'
    - Stream-based: Takes generator input (preserves upstream streaming)
    - One page at a time: Only current page in memory
    - No accumulation: Invalid pages not stored (skipped immediately)
    - Statistics: Counted on-the-fly (not accumulated)
    - Memory: O(1) - constant regardless of file size or skip rate
    - Supports: GB-scale PDFs with any skip rate (even 99% skip)
    
    CRITICAL: Do not convert to list or accumulate:
    - Correct:   for page in filter_page_stream(...): process(page)
    - WRONG:     invalid, stats = filter_pages(...)  # Batch version
    - WRONG:     pages = list(filter_page_stream(...))  # Breaks efficiency!
    
    Args:
        page_stream: Generator yielding page dicts with "text" and "page"
                    (e.g., from enrich_page_stream - MUST be generator)
        min_characters: Minimum characters for valid page (default 10)
        file_name: File name for logging purposes
        
    Yields:
        Valid page dictionaries (immediately eligible for garbage collection)
        
    Logs:
        WARNING: Page number, skip reason, character count (invalid pages)
        INFO: Summary statistics (valid count, skip rate)
        
    Example:
        >>> from src.services.pdf_processor import stream_pdf
        >>> # Process 5GB file, filter invalid, constant memory
        >>> for valid_page in filter_page_stream(stream_pdf("large.pdf")):
        ...     process(valid_page)  # Only valid pages, no accumulation
    """
    skipped_count = 0
    total_count = 0
    
    for page in page_stream:
        total_count += 1
        text = page.get("text", "")
        page_num = page.get("page", 0)
        
        # Validate page content
        if not is_page_valid(text, min_characters=min_characters):
            skipped_count += 1
            # Log skip reason but continue streaming
            reason = "empty/whitespace" if is_page_empty(text) else "insufficient content"
            logger.warning(
                f"Skipping page {page_num} in {file_name}: {reason} "
                f"(length: {len(text.strip())} chars)"
            )
            # Skip this page (not accumulated, just not yielded)
            continue
        
        # Yield after pause here
        # Current page_data eligible for garbage collection after yield
        yield page
    
    # Final summary log (one-time after stream complete)
    if skipped_count > 0:
        skip_rate = round(skipped_count / total_count * 100, 1) if total_count > 0 else 0
        logger.info(
            f"Filtered stream from {file_name}: {total_count - skipped_count}/{total_count} "
            f"valid pages ({skip_rate}% skipped)"
        )


def filter_enriched_page_stream(
    page_stream: Generator[Dict[str, Any], None, None],
    min_characters: int = 10,
    file_name: str = "unknown"
) -> Generator[Dict[str, Any], None, None]:
    """
    Filter enriched pages from stream, skipping invalid/empty pages.
    
    Memory-efficient filtering for enriched pages with metadata.
    Processes pages one at a time while preserving stream characteristics.
    
    MEMORY EFFICIENCY:
    - Generator pattern: Uses 'yield', not 'return'
    - Stream-based: Takes generator input (preserves enrich_page_stream efficiency)
    - One page at a time: Only current enriched page in memory
    - No accumulation: Invalid pages skipped immediately (not stored)
    - Metadata fields: Not re-processed (passed through as-is)
    - Memory: O(1) - constant regardless of file size or skip rate
    - Supports: GB-scale PDFs with full metadata and filtering
    
    CRITICAL: Do not convert to list or accumulate:
    - Correct:   for page in filter_enriched_page_stream(...): process(page)
    - WRONG:     pages = list(filter_enriched_page_stream(...))  # Breaks efficiency!
    
    Args:
        page_stream: Generator yielding enriched page dicts
                    Must include "text", "page", and metadata fields
                    (e.g., from enrich_page_stream - MUST be generator)
        min_characters: Minimum characters for valid page (default 10)
        file_name: File name for logging purposes
        
    Yields:
        Valid enriched page dictionaries with all metadata fields preserved
        (Immediately eligible for garbage collection after yield)
        
    Logs:
        WARNING: Page number, skip reason, character count (invalid pages)
        INFO: Summary statistics (valid count, skip rate)
        
    Example:
        >>> metadata = DocumentMetadata(
        ...     file_name="lecture.pdf",
        ...     department="CS",
        ...     semester="Spring 2024",
        ...     subject="AI"
        ... )
        >>> enriched_stream = enrich_page_stream(stream_pdf("large.pdf"), metadata)
        >>> # Filter and process, constant memory throughout
        >>> for page in filter_enriched_page_stream(enriched_stream, min_characters=50):
        ...     save(page)  # Process immediately, page then discarded
    """
    skipped_count = 0
    total_count = 0
    
    for page in page_stream:
        total_count += 1
        text = page.get("text", "")
        page_num = page.get("page", 0)
        
        # Validate page content
        if not is_page_valid(text, min_characters=min_characters):
            skipped_count += 1
            # Log skip reason but continue streaming
            reason = "empty/whitespace" if is_page_empty(text) else "insufficient content"
            logger.warning(
                f"Skipping enriched page {page_num} in {file_name}: {reason} "
                f"(length: {len(text.strip())} chars)"
            )
            # Skip this page (not accumulated, just not yielded)
            continue
        
        # Yield after pause here
        # Current enriched_page eligible for garbage collection after yield
        yield page
    
    # Final summary log (one-time after stream complete)
    if skipped_count > 0:
        skip_rate = round(skipped_count / total_count * 100, 1) if total_count > 0 else 0
        logger.info(
            f"Filtered enriched stream from {file_name}: {total_count - skipped_count}/"
            f"{total_count} valid pages ({skip_rate}% skipped)"
        )


def get_filtering_stats(
    original_pages: List[Dict[str, Any]],
    filtered_pages: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Generate filtering statistics comparing original and filtered pages.
    
    Args:
        original_pages: List before filtering
        filtered_pages: List after filtering
        
    Returns:
        Statistics dict with totals, removed count, and character metrics
        
    Example:
        >>> original = [...]
        >>> filtered, _ = filter_pages(original)
        >>> stats = get_filtering_stats(original, filtered)
        >>> print(f"Removed {stats['removed_count']} pages")
    """
    original_chars = sum(len(p.get("text", "")) for p in original_pages)
    filtered_chars = sum(len(p.get("text", "")) for p in filtered_pages)
    removed_chars = original_chars - filtered_chars
    
    return {
        "original_count": len(original_pages),
        "filtered_count": len(filtered_pages),
        "removed_count": len(original_pages) - len(filtered_pages),
        "removal_rate": round(
            (len(original_pages) - len(filtered_pages)) / len(original_pages) * 100, 1
        ) if original_pages else 0,
        "original_characters": original_chars,
        "filtered_characters": filtered_chars,
        "removed_characters": removed_chars,
        "avg_chars_kept": round(filtered_chars / len(filtered_pages), 1) if filtered_pages else 0,
    }


if __name__ == "__main__":
    # Example usage
    print("Document Enrichment Utilities\n")
    
    # Example 1: Basic enrichment
    print("=== Example 1: Basic Enrichment ===")
    enriched = enrich_page_data(
        text="This is page content from a PDF.",
        page_number=1,
        file_name="lecture.pdf",
        department="Computer Science",
        semester="Spring 2024",
        subject="Databases"
    )
    print(enriched)
    print()
    
    # Example 2: Using EnrichedPage object
    print("=== Example 2: Using EnrichedPage Object ===")
    page = enrich_page_object(
        text="Page text here...",
        page_number=2,
        file_name="notes.pdf",
        department="Mathematics",
        semester="Fall 2024",
        subject="Calculus"
    )
    print(page)
    print()
    
    # Example 3: Parse filename
    print("=== Example 3: Parse Filename ===")
    parsed = extract_metadata_from_filename("CS101_Spring2024_Lectures.pdf")
    print(parsed)
    print()
    
    # Example 4: Validate enriched page
    print("=== Example 4: Validate Enriched Page ===")
    is_valid = validate_enriched_page(enriched)
    print(f"Valid: {is_valid}")
