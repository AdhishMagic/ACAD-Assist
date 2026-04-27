"""FAISS client for document chunk storage and retrieval."""

import logging
import os
import pickle
from typing import Any, Dict, List, Optional, Sequence, Tuple

import faiss
import numpy as np

from config.settings import settings

logger = logging.getLogger(__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
FAISS_INDEX_PATH = os.path.join(DATA_DIR, "faiss_index.bin")
METADATA_PATH = os.path.join(DATA_DIR, "metadata.pkl")


class VectorDBClient:
    """Reusable FAISS + pickle-backed vector client."""

    def __init__(self, dim: Optional[int] = None):
        self.dim = dim or settings.VECTOR_DB_DIM
        logger.info(
            "VectorDBClient configured for FAISS "
            f"(dim={self.dim}, index_path={FAISS_INDEX_PATH})"
        )

    def _ensure_storage_dir(self) -> None:
        """Create the local data directory when missing."""
        os.makedirs(DATA_DIR, exist_ok=True)

    def _normalize_vector(self, vector: Sequence[float]) -> np.ndarray:
        """Normalize a vector for cosine similarity search via inner product."""
        normalized_vector = np.array(vector, dtype="float32")
        norm = np.linalg.norm(normalized_vector)
        return normalized_vector / norm if norm > 0 else normalized_vector

    def _validate_alignment(
        self, index: Optional[faiss.Index], metadata_list: List[Dict[str, Any]]
    ) -> bool:
        """Verify the FAISS index and metadata list remain aligned."""
        index_size = int(index.ntotal) if index is not None else 0
        metadata_size = len(metadata_list)

        if index_size != metadata_size:
            logger.error(
                "FAISS index and metadata are out of sync "
                f"(index={index_size}, metadata={metadata_size})"
            )
            return False

        return True

    def _load_index_and_metadata(self) -> Tuple[Optional[faiss.Index], List[Dict[str, Any]]]:
        """Load persisted FAISS index and aligned metadata."""
        self._ensure_storage_dir()

        try:
            metadata_list = []
            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, "rb") as metadata_file:
                    metadata_list = pickle.load(metadata_file)

            index = None
            if os.path.exists(FAISS_INDEX_PATH):
                index = faiss.read_index(FAISS_INDEX_PATH)

            if not self._validate_alignment(index, metadata_list):
                return None, []

            if index is not None:
                self.dim = index.d

            return index, metadata_list
        except Exception as exc:
            logger.error(f"Failed to load FAISS storage: {exc}")
            return None, []

    def _save_index_and_metadata(
        self, index: faiss.Index, metadata_list: List[Dict[str, Any]]
    ) -> None:
        """Persist FAISS index and aligned metadata."""
        self._ensure_storage_dir()

        if not self._validate_alignment(index, metadata_list):
            raise ValueError("Cannot persist misaligned FAISS index and metadata")

        temp_index_path = f"{FAISS_INDEX_PATH}.tmp"
        temp_metadata_path = f"{METADATA_PATH}.tmp"

        try:
            faiss.write_index(index, temp_index_path)
            with open(temp_metadata_path, "wb") as metadata_file:
                pickle.dump(metadata_list, metadata_file)

            os.replace(temp_index_path, FAISS_INDEX_PATH)
            os.replace(temp_metadata_path, METADATA_PATH)
        except Exception:
            for temp_path in (temp_index_path, temp_metadata_path):
                if os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except OSError:
                        logger.warning(f"Failed to remove temp file: {temp_path}")
            raise

    def _normalize_chunk(
        self, chunk: Dict[str, Any], expected_dim: Optional[int]
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """Validate and normalize a chunk for insertion."""
        content = chunk.get("content", chunk.get("text", ""))
        embedding = chunk.get("embedding")
        metadata = chunk.get("metadata") or {}
        chunk_id = chunk.get("chunk_id")

        if embedding is None:
            return None, "missing embedding"
        if not isinstance(content, str) or not content.strip():
            return None, "empty content"
        if not chunk_id:
            return None, "missing chunk_id"
        if not isinstance(embedding, Sequence) or isinstance(embedding, (str, bytes)):
            return None, "invalid embedding"

        try:
            normalized_embedding = self._normalize_vector(embedding)
        except (TypeError, ValueError):
            return None, "invalid embedding values"

        if normalized_embedding.size == 0:
            return None, "empty embedding"

        embedding_dim = len(normalized_embedding)
        if expected_dim is not None and embedding_dim != expected_dim:
            return None, (
                f"embedding dimension mismatch "
                f"(expected {expected_dim}, got {embedding_dim})"
            )

        return {
            "chunk_id": chunk_id,
            "content": content,
            "embedding": normalized_embedding,
            "metadata": metadata,
        }, None

    def insert_embeddings(self, chunks: List[Dict[str, Any]]) -> None:
        """Append embedded chunks into the FAISS index and metadata store."""
        total_chunks = len(chunks or [])
        logger.info(f"Inserting {total_chunks} chunks into FAISS")

        if not chunks:
            logger.info("Inserted: 0")
            logger.warning("Skipped: 0 invalid chunks")
            return

        try:
            index, metadata_list = self._load_index_and_metadata()
            existing_dim = index.d if index is not None else None
            expected_dim = existing_dim
            index_size_before = int(index.ntotal) if index is not None else 0
            existing_chunk_ids = {
                item.get("chunk_id")
                for item in metadata_list
                if item.get("chunk_id")
            }

            valid_chunks: List[Dict[str, Any]] = []
            skipped_chunks = 0
            skipped_duplicates = 0

            for chunk in chunks:
                normalized_chunk, reason = self._normalize_chunk(chunk, expected_dim)
                if normalized_chunk is None:
                    skipped_chunks += 1
                    logger.warning(f"Skipped chunk: {reason}")
                    continue
                if normalized_chunk["chunk_id"] in existing_chunk_ids:
                    skipped_duplicates += 1
                    continue
                valid_chunks.append(normalized_chunk)
                existing_chunk_ids.add(normalized_chunk["chunk_id"])

            logger.info(f"Index size before: {index_size_before}")

            if not valid_chunks:
                logger.info("Inserted: 0")
                logger.info(f"Skipped duplicates: {skipped_duplicates}")
                logger.warning(f"Skipped: {skipped_chunks} invalid chunks")
                logger.info(f"Index size after: {index_size_before}")
                return

            inferred_dim = len(valid_chunks[0]["embedding"])
            if index is None:
                index = faiss.IndexFlatIP(inferred_dim)
                self.dim = inferred_dim
            elif index.d != inferred_dim:
                raise ValueError(
                    f"Embedding dimension mismatch: index={index.d}, batch={inferred_dim}"
                )

            vectors = np.array(
                [chunk["embedding"] for chunk in valid_chunks], dtype="float32"
            )
            index.add(vectors)

            metadata_list.extend(
                {
                    "chunk_id": chunk["chunk_id"],
                    "content": chunk["content"],
                    "metadata": chunk["metadata"],
                }
                for chunk in valid_chunks
            )

            self._save_index_and_metadata(index, metadata_list)
            index_size_after = int(index.ntotal)

            if not self._validate_alignment(index, metadata_list):
                logger.error("Post-insert alignment check failed")

            logger.info(f"Inserted: {len(valid_chunks)}")
            logger.info(f"Skipped duplicates: {skipped_duplicates}")
            logger.warning(f"Skipped: {skipped_chunks} invalid chunks")
            logger.info(f"Index size after: {index_size_after}")
        except Exception as exc:
            logger.error(f"Failed to insert embeddings batch: {exc}")

    def add_embeddings(self, items: List[Dict[str, Any]]) -> None:
        """Backward-compatible alias used by existing pipeline code."""
        self.insert_embeddings(items)

    def _matches_filters(
        self, item_metadata: Dict[str, Any], filters: Optional[Dict[str, str]]
    ) -> bool:
        """Check whether a metadata record satisfies the provided filters."""
        if not filters:
            return True

        for field, value in filters.items():
            if value is None:
                continue
            if item_metadata.get(field) != value:
                return False

        return True

    def search(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        filters: Optional[Dict[str, str]] = None,
    ) -> List[Dict[str, Any]]:
        """Run similarity search against stored vectors."""
        if not query_embedding:
            logger.warning("Search requested with empty query embedding")
            return []

        try:
            index, metadata_list = self._load_index_and_metadata()
            if index is None or index.ntotal == 0 or not metadata_list:
                return []

            if not self._validate_alignment(index, metadata_list):
                return []

            if index.d != len(query_embedding):
                raise ValueError(
                    f"Embedding dimension mismatch: index={index.d}, query={len(query_embedding)}"
                )

            query_vector = np.array(
                [self._normalize_vector(query_embedding)], dtype="float32"
            )
            effective_top_k = max(1, min(top_k, len(metadata_list)))

            if filters:
                matching_ids = [
                    idx
                    for idx, item in enumerate(metadata_list)
                    if self._matches_filters(item.get("metadata", {}), filters)
                ]

                if not matching_ids:
                    return []

                all_vectors = index.reconstruct_n(0, index.ntotal)
                filtered_vectors = np.array(
                    [all_vectors[idx] for idx in matching_ids], dtype="float32"
                )
                scores = np.dot(filtered_vectors, query_vector[0])
                ranked_positions = np.argsort(-scores)[: min(top_k, len(matching_ids))]

                return [
                    {
                        "chunk_id": metadata_list[matching_ids[pos]]["chunk_id"],
                        "content": metadata_list[matching_ids[pos]]["content"],
                        "metadata": metadata_list[matching_ids[pos]]["metadata"],
                        "score": float(scores[pos]),
                    }
                    for pos in ranked_positions
                ]

            scores, indices = index.search(query_vector, effective_top_k)
            results: List[Dict[str, Any]] = []

            for score, idx in zip(scores[0], indices[0]):
                if idx < 0 or idx >= len(metadata_list):
                    continue

                item = metadata_list[idx]
                results.append(
                    {
                        "chunk_id": item["chunk_id"],
                        "content": item["content"],
                        "metadata": item["metadata"],
                        "score": float(score),
                    }
                )

            return results
        except Exception as exc:
            logger.error(f"Vector search failed: {exc}")
            return []

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        department: Optional[str] = None,
        semester: Optional[str] = None,
        subject: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Embed a query and retrieve the nearest stored chunks."""
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")

        try:
            from services.embedding_service import embedding_service

            query_embedding = embedding_service.embed(query)
            filters = {
                "department": department,
                "semester": semester,
                "subject": subject,
            }
            results = self.search(query_embedding=query_embedding, top_k=top_k, filters=filters)
            logger.info(f"Retrieved {len(results)} results for query")
            return results
        except Exception as exc:
            logger.error(f"Error during retrieval: {exc}")
            raise

    def get_index_size(self) -> int:
        """Return the number of stored chunks."""
        try:
            index, metadata_list = self._load_index_and_metadata()
            if index is None:
                return 0

            if not self._validate_alignment(index, metadata_list):
                return 0

            return int(index.ntotal)
        except Exception as exc:
            logger.error(f"Failed to count vector rows: {exc}")
            return 0

    def inspect_data(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Return a lightweight preview of stored metadata entries for debugging."""
        try:
            self._ensure_storage_dir()

            if not os.path.exists(METADATA_PATH):
                return []

            with open(METADATA_PATH, "rb") as metadata_file:
                metadata_list = pickle.load(metadata_file)

            if not isinstance(metadata_list, list):
                logger.error("Metadata store is not a list")
                return []

            logger.info(f"Loaded metadata entries: {len(metadata_list)}")

            effective_limit = max(0, limit)
            preview_items = metadata_list[:effective_limit]

            logger.info(f"Showing first {len(preview_items)} entries")

            return [
                {
                    "chunk_id": item.get("chunk_id", ""),
                    "content_preview": str(item.get("content", ""))[:200],
                    "metadata": item.get("metadata", {}),
                }
                for item in preview_items
            ]
        except Exception as exc:
            logger.error(f"Failed to inspect stored metadata: {exc}")
            return []

    def get_indexed_metadata_values(self, field: str) -> set[str]:
        """Return unique non-empty metadata values for a stored field."""
        if not field:
            return set()

        try:
            _, metadata_list = self._load_index_and_metadata()
            values = {
                str(item.get("metadata", {}).get(field)).strip()
                for item in metadata_list
                if str(item.get("metadata", {}).get(field, "")).strip()
            }
            logger.info("Indexed metadata values for %s: %s", field, len(values))
            return values
        except Exception as exc:
            logger.error(f"Failed to read indexed metadata values for {field}: {exc}")
            return set()

    def clear(self) -> None:
        """Delete all stored document chunks."""
        try:
            self._ensure_storage_dir()

            if os.path.exists(FAISS_INDEX_PATH):
                os.remove(FAISS_INDEX_PATH)
            if os.path.exists(METADATA_PATH):
                os.remove(METADATA_PATH)

            logger.info("Cleared stored document chunks")
        except Exception as exc:
            logger.error(f"Failed to clear vector storage: {exc}")

    def close(self) -> None:
        """No-op hook for interface compatibility."""
        logger.info("Closed FAISS vector client")


vector_db_client = VectorDBClient()


def insert_embeddings(chunks: List[Dict[str, Any]]) -> None:
    """Module-level helper for batch vector insertion."""
    vector_db_client.insert_embeddings(chunks)
