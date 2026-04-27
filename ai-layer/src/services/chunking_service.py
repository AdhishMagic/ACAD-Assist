"""Lightweight word-based chunking service for retrieval pipelines."""

import logging
import re
import hashlib
from dataclasses import dataclass
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 500
DEFAULT_OVERLAP = 100
SENTENCE_SPLIT_PATTERN = re.compile(r"(?<=[.!?])\s+")


def _split_into_paragraphs(text: str) -> List[str]:
    """Split text into meaningful paragraph-like units."""
    if "\n\n" in text:
        units = [part.strip() for part in text.split("\n\n")]
        units = [part for part in units if part]
        if len(units) > 1:
            return units

    if "\n" in text:
        units = [part.strip() for part in text.split("\n")]
        units = [part for part in units if part]
        if len(units) > 1:
            return units

    return []


def _split_into_sentences(text: str) -> List[str]:
    """Fallback sentence splitter for unstructured text."""
    units = [part.strip() for part in SENTENCE_SPLIT_PATTERN.split(text)]
    units = [part for part in units if part]

    if units:
        return units

    # Final fallback when regex cannot split.
    units = [part.strip() for part in text.split(". ")]
    return [part for part in units if part]


def _build_chunk_dict(
    *,
    file_id: str,
    file_name: str,
    metadata: Dict[str, Any],
    chunk_index: int,
    content: str,
) -> Dict[str, Any]:
    """Create the strict chunk payload expected by downstream systems."""
    chunk_id_seed = f"{file_id}:{chunk_index}:{content.strip()}"
    return {
        "chunk_id": hashlib.sha256(chunk_id_seed.encode("utf-8")).hexdigest(),
        "content": content,
        "metadata": {
            "file_id": file_id,
            "file_name": file_name,
            "file_path": metadata.get("file_path", ""),
            "relative_path": metadata.get("relative_path", ""),
            "department": metadata.get("department", ""),
            "subject": metadata.get("subject", ""),
            "semester": metadata.get("semester", ""),
            "unit": metadata.get("unit", ""),
            "chunk_index": chunk_index,
        },
    }


def _build_chunks_from_units(
    units: List[str],
    *,
    file_id: str,
    file_name: str,
    metadata: Dict[str, Any],
    chunk_size: int,
    overlap: int,
) -> List[Dict[str, Any]]:
    """Combine paragraph/sentence units into overlapping word-based chunks."""
    if not units:
        return []

    chunks: List[Dict[str, Any]] = []
    current_words: List[str] = []

    def flush_current_words() -> None:
        nonlocal current_words
        chunk_content = " ".join(current_words).strip()
        if chunk_content:
            chunks.append(
                _build_chunk_dict(
                    file_id=file_id,
                    file_name=file_name,
                    metadata=metadata,
                    chunk_index=len(chunks),
                    content=chunk_content,
                )
            )
        current_words = current_words[-overlap:] if overlap else []

    for unit in units:
        unit_words = unit.split()
        if not unit_words:
            continue

        remaining_words = unit_words
        while remaining_words:
            if current_words and len(current_words) >= chunk_size:
                flush_current_words()

            available_space = chunk_size - len(current_words)
            if available_space <= 0:
                flush_current_words()
                available_space = chunk_size - len(current_words)

            if len(remaining_words) <= available_space:
                current_words.extend(remaining_words)
                break

            if current_words:
                current_words.extend(remaining_words[:available_space])
                flush_current_words()
                remaining_words = remaining_words[available_space:]
                continue

            current_words.extend(remaining_words[:chunk_size])
            flush_current_words()
            remaining_words = remaining_words[chunk_size:]

    if current_words:
        flush_current_words()

    return chunks


def chunk_text(document: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Split extracted document text into overlapping chunks for embeddings.

    Args:
        document: Dict with file_id, file_name, text, and metadata keys.

    Returns:
        List of chunk dictionaries.
    """
    text = (document or {}).get("text", "")
    if not text or not text.strip():
        return []

    file_id = document.get("file_id", "")
    file_name = document.get("file_name", "")
    metadata = document.get("metadata") or {}
    words = text.split()

    logger.info("Chunking file: %s", file_name or file_id or "unknown")

    if len(words) <= DEFAULT_CHUNK_SIZE:
        chunks = [
            _build_chunk_dict(
                file_id=file_id,
                file_name=file_name,
                metadata=metadata,
                chunk_index=0,
                content=text.strip(),
            )
        ]
        logger.info("Total chunks: %s", len(chunks))
        return chunks

    units = _split_into_paragraphs(text)
    if not units:
        units = _split_into_sentences(text)
    if not units:
        units = [text.strip()]

    chunks = _build_chunks_from_units(
        units,
        file_id=file_id,
        file_name=file_name,
        metadata=metadata,
        chunk_size=DEFAULT_CHUNK_SIZE,
        overlap=DEFAULT_OVERLAP,
    )

    avg_size = (
        sum(len(chunk["content"].split()) for chunk in chunks) / len(chunks)
        if chunks
        else 0
    )
    logger.info("Total chunks: %s", len(chunks))
    logger.debug("Average chunk size: %.2f words", avg_size)
    return chunks


@dataclass
class SemanticChunk:
    """Compatibility wrapper for existing pipeline code."""

    chunk_id: str
    text: str
    metadata: Dict[str, Any]

    @property
    def custom_metadata(self) -> Dict[str, Any]:
        return self.metadata

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "content": self.text,
            "metadata": self.metadata,
        }


class ChunkingService:
    """Compatibility class wrapper over the lightweight chunking function."""

    def __init__(
        self,
        min_chunk_tokens: int = DEFAULT_CHUNK_SIZE,
        max_chunk_tokens: int = DEFAULT_CHUNK_SIZE,
        overlap_tokens: int = DEFAULT_OVERLAP,
        tokenizer_type: str = "simple",
        strategy: str = "preserve_paragraphs",
        enable_overlap_optimization: bool = True,
    ) -> None:
        self.min_chunk_tokens = min_chunk_tokens
        self.max_chunk_tokens = max_chunk_tokens
        self.overlap_tokens = overlap_tokens
        self.tokenizer_type = tokenizer_type
        self.strategy = strategy
        self.enable_overlap_optimization = enable_overlap_optimization

    def chunk_text(
        self,
        text: str,
        file_name: str = "",
        page_number: int | None = None,
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] | None = None,
    ) -> List[SemanticChunk]:
        metadata = dict(custom_metadata or {})
        metadata.setdefault("page_number", page_number)
        metadata.setdefault("department", department)
        metadata.setdefault("semester", semester)
        metadata.setdefault("subject", subject)
        metadata.setdefault("section", section)
        metadata.setdefault("topic", topic)
        metadata.setdefault("author", author)
        metadata.setdefault("unit", section or topic)

        chunk_dicts = chunk_text(
            {
                "file_id": metadata.get("file_id", ""),
                "file_name": file_name,
                "text": text,
                "metadata": metadata,
            }
        )

        return [
            SemanticChunk(
                chunk_id=chunk["chunk_id"],
                text=chunk["content"],
                metadata=chunk["metadata"],
            )
            for chunk in chunk_dicts
        ]
