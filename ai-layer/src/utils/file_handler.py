"""File handling utilities for ingestion and metadata extraction."""

import logging
import os
import re
import stat
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

import config.logging  # noqa: F401

from models.file_metadata_models import FileMetadata

logger = logging.getLogger(__name__)

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}
UNIT_PATTERN = re.compile(r"Unit\s*\d+", re.IGNORECASE)
UPPERCASE_FOLDER_PATTERN = re.compile(r"[A-Z][A-Z0-9&_\- ]{1,}")


def normalize_windows_path(path: str) -> str:
    """Normalize a path and add the Windows long-path prefix when needed."""
    resolved_path = str(Path(path).expanduser().resolve())

    if os.name != "nt":
        return resolved_path

    if resolved_path.startswith("\\\\?\\"):
        return resolved_path

    if resolved_path.startswith("\\\\"):
        unc_path = resolved_path.lstrip("\\")
        return f"\\\\?\\UNC\\{unc_path}"

    return f"\\\\?\\{resolved_path}"


def validate_root_directory(base_path: str) -> str:
    """
    Validate and normalize a directory path.

    Args:
        base_path: Directory path to validate

    Returns:
        Normalized absolute path
    """
    if not base_path or not isinstance(base_path, str):
        raise ValueError("Base path must be a non-empty string")

    normalized_path = normalize_windows_path(base_path)
    path = Path(normalized_path)

    if not path.exists():
        raise FileNotFoundError(f"Directory not found: {base_path}")

    if not path.is_dir():
        raise NotADirectoryError(f"Not a directory: {base_path}")

    logger.debug("Validated root directory: %s", path)
    return str(path)


def get_file_rejection_reason(file_name: str, file_path: str) -> Optional[str]:
    """
    Return the rejection reason for a file, or None if the file is valid.

    Supported files:
    - .pdf
    - .docx
    - .txt

    Ignored files:
    - Temporary Office files (~$*)
    - Hidden/system files
    """
    normalized_name = Path(file_name).name

    if not normalized_name:
        return "missing file name"

    if normalized_name.startswith("~$"):
        return "temporary file"

    if normalized_name.startswith("."):
        return "hidden file"

    if normalized_name in {".DS_Store", "Thumbs.db"}:
        return "system file"

    suffix = Path(normalized_name).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        return f"unsupported file type: {suffix or 'no extension'}"

    try:
        file_attributes = Path(file_path).stat().st_file_attributes
        if file_attributes & stat.FILE_ATTRIBUTE_HIDDEN:
            return "hidden file"
        if file_attributes & stat.FILE_ATTRIBUTE_SYSTEM:
            return "system file"
    except (AttributeError, OSError):
        # Attribute flags are not always available; filename checks are the fallback.
        pass

    return None


def is_valid_file(file_name: str, file_path: str) -> bool:
    """Check whether a file should be included in ingestion."""
    return get_file_rejection_reason(file_name, file_path) is None


def scan_directory(root_path: str) -> List[str]:
    """
    Recursively scan a directory and return valid file paths.

    Uses pathlib for cross-platform recursive scanning with deterministic output.
    """
    folder_path = validate_root_directory(root_path)
    folder_path = normalize_windows_path(folder_path)
    logger.info("Scanning path: %s", folder_path)

    valid_files: List[str] = []
    total_files_scanned = 0
    skipped_files = 0

    files = sorted(
        (path for path in Path(folder_path).rglob("*") if path.is_file()),
        key=lambda path: str(path),
    )

    for file_path in files:
        try:
            resolved_path = file_path.resolve()
            total_files_scanned += 1
            rejection_reason = get_file_rejection_reason(resolved_path.name, str(resolved_path))

            if rejection_reason is None:
                valid_files.append(str(resolved_path))
            else:
                skipped_files += 1
                logger.warning("Skipped: %s (%s)", resolved_path.name, rejection_reason)
        except Exception as exc:
            skipped_files += 1
            logger.error("Failed processing: %s (%s)", file_path, exc)

    logger.info("Scanned %s files", total_files_scanned)
    logger.info("Valid files: %s", len(valid_files))
    return valid_files


def scan_pdfs(root_path: str, ignore_hidden: bool = True) -> List[str]:
    """
    Backward-compatible PDF-only scan helper.

    Args:
        root_path: Root directory to scan
        ignore_hidden: Retained for API compatibility
    """
    del ignore_hidden
    return [file_path for file_path in scan_directory(root_path) if file_path.lower().endswith(".pdf")]


def extract_metadata_from_path(file_path: str, root_path: str) -> Dict[str, str]:
    """
    Extract document metadata from a file path.

    Extract department, semester, subject, and unit dynamically from Path.parts.
    """
    file_path_obj = Path(file_path).resolve()
    root_path_obj = Path(validate_root_directory(root_path)).resolve()
    path_parts = list(file_path_obj.parts)
    root_parts = list(root_path_obj.parts)

    if not path_parts:
        raise ValueError(f"Unable to determine metadata from path: {file_path}")

    metadata_parts = _extract_metadata_parts(path_parts, root_parts)
    department = _detect_department(metadata_parts)
    semester = _detect_semester(metadata_parts)
    subject = _detect_subject(metadata_parts, semester)
    unit = _detect_unit(metadata_parts)

    return {
        "department": department,
        "semester": semester,
        "subject": subject,
        "unit": unit,
    }


def _detect_department(path_parts: List[str]) -> str:
    """Detect department as the folder immediately after the Departments root."""
    if path_parts and path_parts[0].strip():
        return path_parts[0].strip()
    return "General"


def _detect_semester(path_parts: List[str]) -> str:
    """Detect semester folder from path parts."""
    for part in path_parts:
        normalized_part = part.strip()
        if normalized_part.lower().startswith("semester"):
            return normalized_part
    return "General"


def _detect_subject(path_parts: List[str], semester: str) -> str:
    """Detect the subject as the folder immediately after the semester folder."""
    if semester == "General":
        return "General"

    for index, part in enumerate(path_parts):
        if part == semester:
            if index + 1 < len(path_parts):
                subject = path_parts[index + 1].strip()
                return subject or "General"
            break
    return "General"


def _extract_metadata_parts(path_parts: List[str], root_parts: List[str]) -> List[str]:
    """Return path segments that should be used for metadata extraction."""
    departments_index = _find_departments_index(path_parts)
    if departments_index is not None:
        return path_parts[departments_index + 1 : -1]

    if len(path_parts) >= len(root_parts) and path_parts[: len(root_parts)] == root_parts:
        return path_parts[len(root_parts) : -1]

    raise ValueError(f"File not in root directory: {Path(*path_parts)}")


def _find_departments_index(path_parts: List[str]) -> Optional[int]:
    """Find the Departments folder in a path, case-insensitively."""
    for index, part in enumerate(path_parts):
        if part.strip().lower() == "departments":
            return index
    return None


def _detect_unit(path_parts: List[str]) -> str:
    """Detect unit folder using regex-based matching."""
    for part in path_parts:
        match = UNIT_PATTERN.search(part)
        if match:
            return match.group(0)
    return "General"


def build_metadata_object(file_path: str, root_path: str, metadata: Dict[str, str]) -> FileMetadata:
    """
    Build FileMetadata from a file path and extracted metadata.
    """
    file_path_obj = Path(file_path).resolve()

    if not file_path_obj.is_file():
        raise ValueError(f"Not a file: {file_path}")

    stat_result = file_path_obj.stat()
    timestamp = datetime.fromtimestamp(stat_result.st_mtime).isoformat()

    return FileMetadata(
        department=metadata["department"],
        semester=metadata["semester"],
        subject=metadata["subject"],
        unit=metadata.get("unit", "General"),
        file_name=file_path_obj.name,
        file_path=str(file_path_obj),
        file_size=stat_result.st_size,
        extension=file_path_obj.suffix.lower(),
        created_at=timestamp,
    )


def process_directory(root_path: str, ignore_hidden: bool = True) -> List[FileMetadata]:
    """
    Process a directory into FileMetadata objects.

    Retained for compatibility with the earlier PDF metadata flow.
    """
    del ignore_hidden

    normalized_root = validate_root_directory(root_path)
    file_paths = scan_directory(normalized_root)

    if not file_paths:
        logger.warning("No supported files found in: %s", normalized_root)
        return []

    metadata_list: List[FileMetadata] = []
    errors = 0

    for file_path in file_paths:
        try:
            hierarchy = extract_metadata_from_path(file_path, normalized_root)
            metadata_list.append(build_metadata_object(file_path, normalized_root, hierarchy))
        except (OSError, ValueError) as exc:
            errors += 1
            logger.error("Failed to process file metadata for %s: %s", file_path, exc)

    logger.info(
        "Processed directory metadata: %s success, %s errors",
        len(metadata_list),
        errors,
    )
    return metadata_list
