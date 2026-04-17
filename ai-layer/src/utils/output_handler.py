"""Output pipeline for storing and serializing file metadata - Phase 1 (minimal)."""

import json
import logging
from pathlib import Path
from typing import List, Optional, Dict, Any

from models.file_metadata_models import FileMetadata

logger = logging.getLogger(__name__)


class MetadataSerializer:
    """Serializer for FileMetadata objects to flat RAG-indexable format."""
    
    @staticmethod
    def serialize_metadata(metadata: FileMetadata) -> Dict[str, Any]:
        """
        Serialize FileMetadata object to flat dictionary for RAG indexing.
        
        Args:
            metadata: FileMetadata object to serialize
            
        Returns:
            Flat dictionary with 9 fields for indexing
        """
        return {
            "id": metadata.id,
            "department": metadata.department,
            "semester": metadata.semester,
            "subject": metadata.subject,
            "file_name": metadata.file_name,
            "file_path": metadata.file_path,
            "file_size": metadata.file_size,
            "extension": metadata.extension,
            "created_at": metadata.created_at,
        }
    
    @staticmethod
    def serialize_batch(metadata_list: List[FileMetadata]) -> List[Dict[str, Any]]:
        """
        Serialize list of FileMetadata objects.
        
        Args:
            metadata_list: List of FileMetadata objects
            
        Returns:
            List of flat dictionaries
        """
        return [MetadataSerializer.serialize_metadata(m) for m in metadata_list]


class OutputPipeline:
    """Pipeline for saving metadata to JSONL format for RAG indexing."""
    
    @staticmethod
    def save_metadata_jsonl(
        metadata_list: List[FileMetadata],
        filename: str = "metadata.jsonl",
        output_path: Optional[str] = None,
    ) -> str:
        """
        Save metadata list to JSONL (JSON Lines) format.
        
        One flat JSON object per line, optimized for RAG indexing.
        
        Args:
            metadata_list: List of FileMetadata objects to save
            filename: Name of output file (default: metadata.jsonl)
            output_path: Output directory (creates if not exists)
            
        Returns:
            Path to saved JSONL file
            
        Raises:
            ValueError: If metadata_list is empty
            IOError: If file write fails
            
        Example:
            >>> from file_handler import process_directory
            >>> metadata_list = process_directory("/path/to/docs")
            >>> file_path = OutputPipeline.save_metadata_jsonl(metadata_list, output_path="/output")
            >>> print(f"Saved to: {file_path}")
        """
        if not metadata_list:
            raise ValueError("metadata_list cannot be empty")
        
        if output_path is None:
            output_path = "."
        
        target_dir = Path(output_path).resolve()
        
        # Ensure directory exists
        try:
            target_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            raise IOError(f"Failed to create output directory '{target_dir}': {str(e)}")
        
        file_path = target_dir / filename
        
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                for metadata in metadata_list:
                    serialized = MetadataSerializer.serialize_metadata(metadata)
                    f.write(json.dumps(serialized, ensure_ascii=False) + "\n")
            
            file_size_kb = file_path.stat().st_size / 1024
            logger.info(
                f"Saved {len(metadata_list)} metadata records to JSONL: {file_path} "
                f"({file_size_kb:.2f} KB)"
            )
            return str(file_path)
        
        except IOError as e:
            raise IOError(f"Failed to write JSONL file '{file_path}': {str(e)}")
