"""File handling utilities for PDF metadata extraction - Phase 1."""

import logging
from pathlib import Path
from typing import List
from datetime import datetime

from models.file_metadata_models import FileMetadata

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def validate_root_directory(base_path: str) -> str:
    """
    Validate and normalize root directory path.
    
    Args:
        base_path: Directory path
        
    Returns:
        Normalized absolute path
        
    Raises:
        ValueError: If invalid
        FileNotFoundError: If not found
        NotADirectoryError: If not a directory
    """
    if not base_path or not isinstance(base_path, str):
        raise ValueError("Base path must be nontempty string")
    
    path = Path(base_path).resolve()
    
    if not path.exists():
        raise FileNotFoundError(f"Directory not found: {base_path}")
    
    if not path.is_dir():
        raise NotADirectoryError(f"Not a directory: {base_path}")
    
    logger.debug(f"Validated root: {path}")
    return str(path)


def scan_pdfs(root_path: str, ignore_hidden: bool = True) -> List[str]:
    """
    Find all PDF files recursively in directory.
    
    Args:
        root_path: Root directory to scan
        ignore_hidden: Skip hidden/system files
        
    Returns:
        List of absolute file paths
        
    Raises:
        FileNotFoundError: If root not found
        ValueError: If invalid path
    """
    root = Path(validate_root_directory(root_path))
    logger.info(f"Scanning for PDFs: {root}")
    
    pdf_files = []
    
    for pdf_file in root.rglob("*.pdf"):
        # Skip hidden files
        if ignore_hidden and any(part.startswith(".") for part in pdf_file.parts):
            continue
        
        pdf_files.append(str(pdf_file.resolve()))
    
    logger.info(f"Found {len(pdf_files)} PDF files")
    return sorted(pdf_files)


def extract_metadata_from_path(file_path: str, root_path: str) -> dict:
    """
    Extract metadata from file path structure.
    
    Expected: root/department/semester/subject/file.pdf
    
    Args:
        file_path: Full file path
        root_path: Root directory path
        
    Returns:
        Dict with department, semester, subject
        
    Raises:
        ValueError: If structure invalid
    """
    file_p = Path(file_path).resolve()
    root_p = Path(validate_root_directory(root_path))
    
    try:
        relative = file_p.relative_to(root_p)
    except ValueError:
        raise ValueError(f"File not in root directory: {file_path}")
    
    parts = relative.parts[:-1]  # Exclude filename
    
    if len(parts) < 3:
        raise ValueError(
            f"Invalid structure. Need 3+ levels, got {len(parts)}: {'/'.join(parts)}"
        )
    
    return {
        "department": parts[0],
        "semester": parts[1],
        "subject": parts[2],
    }


def build_metadata_object(file_path: str, root_path: str, metadata: dict) -> FileMetadata:
    """
    Build FileMetadata object from file and extracted metadata.
    
    Args:
        file_path: Full file path
        root_path: Root directory
        metadata: Dict from extract_metadata_from_path()
        
    Returns:
        FileMetadata object
        
    Raises:
        ValueError: If metadata invalid
        OSError: If file access fails
    """
    file_p = Path(file_path).resolve()
    
    if not file_p.is_file():
        raise ValueError(f"Not a file: {file_path}")
    
    # Get file stats
    stat = file_p.stat()
    timestamp = datetime.fromtimestamp(stat.st_mtime).isoformat()
    
    return FileMetadata(
        department=metadata["department"],
        semester=metadata["semester"],
        subject=metadata["subject"],
        file_name=file_p.name,
        file_path=str(file_p),
        file_size=stat.st_size,
        extension=file_p.suffix.lower(),
        created_at=timestamp,
    )


def process_directory(root_path: str, ignore_hidden: bool = True) -> List[FileMetadata]:
    """
    Process directory: scan, extract metadata, return FileMetadata objects.
    
    Main entry point for Phase 1 file processing.
    
    Args:
        root_path: Directory to process
        ignore_hidden: Skip hidden/system files
        
    Returns:
        List of FileMetadata objects
        
    Raises:
        FileNotFoundError: If root not found
        ValueError: If processing fails
    """
    logger.info(f"Processing directory: {root_path}")
    
    # Validate root
    root_path = validate_root_directory(root_path)
    
    # Scan for PDFs
    pdf_files = scan_pdfs(root_path, ignore_hidden)
    
    if not pdf_files:
        logger.warning("No PDF files found")
        return []
    
    # Extract metadata for each file
    metadata_list = []
    errors = []
    
    for idx, file_path in enumerate(pdf_files, 1):
        try:
            # Extract hierarchy metadata
            hierarchy = extract_metadata_from_path(file_path, root_path)
            
            # Build metadata object
            metadata_obj = build_metadata_object(file_path, root_path, hierarchy)
            metadata_list.append(metadata_obj)
            
            if idx % 10 == 0:
                logger.debug(f"Processed {idx}/{len(pdf_files)} files")
        
        except (ValueError, OSError) as e:
            logger.warning(f"Skipping {file_path}: {str(e)}")
            errors.append((file_path, str(e)))
    
    logger.info(
        f"Processing complete: {len(metadata_list)} success, "
        f"{len(errors)} errors"
    )
    
    if errors:
        logger.warning(f"Failed to process {len(errors)} files")
        for path, error in errors[:5]:  # Log first 5
            logger.debug(f"  - {path}: {error}")
    
    return metadata_list
