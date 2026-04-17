"""FAISS-based Vector Database Client - Local, in-memory vector storage."""

import logging
import numpy as np
from pathlib import Path
from typing import List, Dict, Optional

try:
    import faiss
except ImportError:
    raise ImportError("FAISS not installed. Install with: pip install faiss-cpu")

logger = logging.getLogger(__name__)


class VectorDBClient:
    """
    FAISS-based vector database client.
    
    Features:
    - In-memory vector storage with FAISS
    - Local persistence to disk
    - Similarity search using L2 distance
    - Metadata storage parallel to embeddings
    """
    
    def __init__(self, dim: int = 384):
        """
        Initialize FAISS Vector DB Client.
        
        Args:
            dim: Embedding dimension (default: 384 for all-MiniLM-L6-v2)
        """
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.metadata = []  # Parallel list to store metadata
        self.chunk_ids = []  # Parallel list to store chunk_ids
        logger.info(f"VectorDBClient initialized with dimension {dim}")
    
    def add_embeddings(self, items: List[Dict]) -> None:
        """
        Add embeddings to the FAISS index.
        
        Args:
            items: List of dicts with format:
                {
                    "chunk_id": str,
                    "embedding": List[float],
                    "text": str,
                    "metadata": dict (optional)
                }
        """
        if not items:
            logger.warning("No items to add")
            return
        
        # Collect embeddings
        embeddings = []
        for item in items:
            embedding = np.array(item["embedding"], dtype=np.float32)
            if embedding.shape[0] != self.dim:
                raise ValueError(
                    f"Embedding dimension mismatch: expected {self.dim}, got {embedding.shape[0]}"
                )
            embeddings.append(embedding)
        
        # Convert to numpy array and add to FAISS index
        embeddings_array = np.array(embeddings, dtype=np.float32)
        self.index.add(embeddings_array)
        
        # Store metadata and chunk_ids in parallel
        for item in items:
            self.chunk_ids.append(item["chunk_id"])
            self.metadata.append({
                "chunk_id": item["chunk_id"],
                "text": item["text"],
                "metadata": item.get("metadata", {})
            })
        
        logger.info(f"Added {len(items)} embeddings to FAISS index. Index size: {self.index.ntotal}")
    
    def _matches_filters(self, metadata: Dict, filters: Dict[str, str]) -> bool:
        """
        Check if metadata matches all provided filters.
        
        Args:
            metadata: Metadata dict from chunk
            filters: Dict with optional keys: department, semester, subject
            
        Returns:
            True if metadata matches all filters, False otherwise
        """
        for key, value in filters.items():
            if value is None:
                continue
            # Check metadata for the filter key
            if metadata.get(key) != value:
                return False
        return True
    
    def search(self, query_embedding: List[float], top_k: int = 5, filters: Optional[Dict[str, str]] = None) -> List[Dict]:
        """
        Search for similar embeddings with optional metadata filtering.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of top results to return
            filters: Optional dict with keys: department, semester, subject
                     Only results matching ALL filters are returned
                     Example: {"department": "Computer Science", "semester": "Spring 2024"}
            
        Returns:
            List of dicts with format:
                {
                    "chunk_id": str,
                    "text": str,
                    "metadata": dict,
                    "score": float (L2 distance)
                }
        """
        if self.index.ntotal == 0:
            logger.warning("Search requested on empty index")
            return []
        
        filters = filters or {}
        
        # When filtering, retrieve more results to ensure we get enough filtered results
        # Strategy: Get 3x more results, then filter and return top_k
        search_k = min(top_k * 3 if filters else top_k, self.index.ntotal)
        
        # Convert query to numpy array and reshape
        query_array = np.array([query_embedding], dtype=np.float32)
        
        # Search FAISS index
        distances, indices = self.index.search(query_array, search_k)
        
        # Compile results with optional filtering
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx >= 0:  # FAISS returns -1 for invalid results
                metadata_entry = self.metadata[idx]
                
                # Apply filters if provided
                if filters and not self._matches_filters(metadata_entry["metadata"], filters):
                    continue
                
                results.append({
                    "chunk_id": metadata_entry["chunk_id"],
                    "text": metadata_entry["text"],
                    "metadata": metadata_entry["metadata"],
                    "score": float(distance)
                })
                
                # Stop when we have enough results
                if len(results) >= top_k:
                    break
        
        if filters and len(results) < top_k:
            logger.debug(
                f"Filtering reduced results from {search_k} to {len(results)} "
                f"(requested {top_k} with filters: {filters})"
            )
        
        return results
    
    def save(self, path: str) -> None:
        """
        Save FAISS index and metadata to disk.
        
        Persists:
        - FAISS index as binary file (index.faiss)
        - Metadata, chunk_ids, and config as JSON (metadata.json)
        
        Args:
            path: Directory path to save index and metadata
            
        Raises:
            OSError: If directory cannot be created or files cannot be written
            RuntimeError: If index-metadata alignment is invalid
        """
        save_path = Path(path)
        
        try:
            # Create directory
            save_path.mkdir(parents=True, exist_ok=True)
            
            # Validate alignment: check index and metadata are in sync
            if len(self.metadata) != self.index.ntotal:
                raise RuntimeError(
                    f"Index-metadata misalignment: index has {self.index.ntotal} vectors "
                    f"but metadata has {len(self.metadata)} entries"
                )
            
            # Save FAISS index as binary
            index_path = save_path / "index.faiss"
            faiss.write_index(self.index, str(index_path))
            logger.debug(f"Saved FAISS index to {index_path}")
            
            # Save metadata and config as JSON (human-readable, portable)
            import json
            metadata_path = save_path / "metadata.json"
            metadata_config = {
                "dim": self.dim,
                "index_size": self.index.ntotal,
                "metadata": self.metadata,
                "chunk_ids": self.chunk_ids
            }
            
            with open(metadata_path, "w", encoding="utf-8") as f:
                json.dump(metadata_config, f, indent=2, ensure_ascii=False)
            logger.debug(f"Saved metadata to {metadata_path}")
            
            logger.info(
                f"FAISS index persisted: {index_path.name} ({self.index.ntotal} vectors), "
                f"{metadata_path.name}"
            )
        
        except OSError as e:
            logger.error(f"File system error during save: {e}")
            raise
        except RuntimeError as e:
            logger.error(f"Index validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Failed to save FAISS index: {e}")
            raise
    
    def load(self, path: str) -> None:
        """
        Load FAISS index and metadata from disk.
        
        Restores:
        - FAISS index from binary file (index.faiss)
        - Metadata, chunk_ids, and config from JSON (metadata.json)
        
        Validates index-metadata alignment during load.
        
        Args:
            path: Directory path containing index and metadata files
            
        Raises:
            FileNotFoundError: If index or metadata files are missing
            ValueError: If files exist but cannot be parsed or are misaligned
            RuntimeError: If index-metadata alignment is invalid
        """
        load_path = Path(path)
        
        try:
            # Check directory exists
            if not load_path.exists():
                raise FileNotFoundError(f"Persistence directory not found: {load_path}")
            
            # Check FAISS index file exists
            index_path = load_path / "index.faiss"
            if not index_path.exists():
                raise FileNotFoundError(
                    f"FAISS index file not found: {index_path}. "
                    f"Please ensure {index_path.name} exists in {load_path}"
                )
            
            # Check metadata file exists
            metadata_path = load_path / "metadata.json"
            if not metadata_path.exists():
                raise FileNotFoundError(
                    f"Metadata file not found: {metadata_path}. "
                    f"Please ensure {metadata_path.name} exists in {load_path}"
                )
            
            # Load FAISS index
            logger.debug(f"Loading FAISS index from {index_path}")
            self.index = faiss.read_index(str(index_path))
            
            # Load metadata and config from JSON
            import json
            logger.debug(f"Loading metadata from {metadata_path}")
            with open(metadata_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.dim = data["dim"]
                self.metadata = data["metadata"]
                self.chunk_ids = data["chunk_ids"]
                stored_index_size = data.get("index_size", len(self.metadata))
            
            # Validate alignment
            if self.index.ntotal != len(self.metadata):
                raise RuntimeError(
                    f"Index-metadata misalignment detected: index has {self.index.ntotal} vectors "
                    f"but metadata has {len(self.metadata)} entries. "
                    f"This may indicate corrupted persistence files."
                )
            
            if self.index.ntotal != stored_index_size:
                logger.warning(
                    f"Stored index size ({stored_index_size}) differs from actual index size "
                    f"({self.index.ntotal}). This may indicate partial persistence."
                )
            
            logger.info(
                f"FAISS index restored from {load_path}: "
                f"{self.index.ntotal} vectors, dimension={self.dim}"
            )
        
        except FileNotFoundError as e:
            logger.error(f"Missing persistence file: {e}")
            raise
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON metadata: {e}")
            raise ValueError(f"Cannot parse metadata.json: {e}")
        except RuntimeError as e:
            logger.error(f"Index validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Failed to load FAISS index: {e}")
            raise
    
    def clear(self) -> None:
        """
        Clear the FAISS index and metadata.
        
        Resets index, metadata, and chunk_ids to empty state.
        Dimension is preserved from initialization.
        """
        self.index = faiss.IndexFlatL2(self.dim)
        self.metadata = []
        self.chunk_ids = []
        logger.info("FAISS index and metadata cleared")
    
    def get_index_size(self) -> int:
        """
        Get the number of embeddings in the index.
        
        Returns:
            Number of embeddings stored
        """
        return self.index.ntotal
    
    def retrieve(
        self,
        query: str,
        top_k: int = 5,
        department: Optional[str] = None,
        semester: Optional[str] = None,
        subject: Optional[str] = None,
    ) -> List[Dict]:
        """
        Retrieve relevant documents using semantic search with optional metadata filtering.
        
        Complete retrieval flow:
        1. Convert query text to embedding
        2. Search FAISS index for similar embeddings
        3. Filter by department, semester, subject if provided
        4. Return ranked results with scores
        
        Args:
            query: User query text (any language, will be embedded)
            top_k: Number of top results to return (default: 5)
            department: Optional department filter (e.g., "Computer Science")
            semester: Optional semester filter (e.g., "Spring 2024")
            subject: Optional subject filter (e.g., "Algorithms")
            
        Returns:
            List of dicts with format:
                {
                    "text": str (chunk text),
                    "metadata": dict (chunk metadata),
                    "score": float (L2 distance - lower is better)
                }
            
        Raises:
            ValueError: If query is empty or index is empty
            
        Example:
            >>> from integrations.vector_db_client import vector_db_client
            >>> # Without filters
            >>> results = vector_db_client.retrieve(
            ...     query="What is machine learning?",
            ...     top_k=5
            ... )
            >>> 
            >>> # With filters
            >>> results = vector_db_client.retrieve(
            ...     query="Explain algorithms",
            ...     top_k=5,
            ...     department="Computer Science",
            ...     semester="Spring 2024",
            ...     subject="Algorithms"
            ... )
            >>> for result in results:
            ...     print(f"{result['text'][:100]}... (score: {result['score']:.4f})")
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty")
        
        if self.index.ntotal == 0:
            logger.warning("Retrieve requested on empty index")
            raise ValueError("Vector database is empty. No embeddings to search.")
        
        try:
            # Step 1: Import here to avoid circular imports
            from services.embedding_service import embedding_service
            
            # Step 2: Convert query to embedding
            logger.debug(f"Embedding query: {query[:100]}...")
            query_embedding = embedding_service.embed(query)
            
            # Step 3: Build filters dict
            filters = {}
            if department is not None:
                filters["department"] = department
            if semester is not None:
                filters["semester"] = semester
            if subject is not None:
                filters["subject"] = subject
            
            # Step 4: Search FAISS index with filters
            if filters:
                logger.debug(f"Searching FAISS index with filters: {filters}")
            logger.debug(f"Searching FAISS index for top {top_k} results")
            results = self.search(query_embedding, top_k=top_k, filters=filters if filters else None)
            
            # Step 5: Format results (remove chunk_id for clean output)
            formatted_results = [
                {
                    "text": result["text"],
                    "metadata": result["metadata"],
                    "score": result["score"]
                }
                for result in results
            ]
            
            logger.info(f"Retrieved {len(formatted_results)} results for query")
            return formatted_results
        
        except Exception as e:
            logger.error(f"Error during retrieval: {e}")
            raise


vector_db_client = VectorDBClient()
