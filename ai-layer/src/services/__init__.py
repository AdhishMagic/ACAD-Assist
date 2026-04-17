"""
Services module - Consolidated document processing and embedding services.

Main exports:
- ChunkingService: Unified token-based semantic chunking
- PipelineService: Memory-efficient document streaming pipeline
- DocumentService: PDF and text extraction
- EmbeddingService: Text embedding generation

Production Ready:
All services merged into minimal, optimized components with no duplication.
"""

# Consolidated chunking service
from .chunking_service import (
    ChunkingService,
    SemanticChunk,
    ChunkMetadata,
    TokenChunk,
    OverlapConfig,
    OverlapOptimizer,
    OverlapStrategy,
    OverlapRegion,
    OverlapStatistics,
    BoundaryType,
    BoundaryDetector,
    ReadabilityAnalyzer,
    SplitStrategy,
    Tokenizer,
    TiktokenTokenizer,
    TransformersTokenizer,
    SimpleTokenizer,
)

# Document services
from .document_service import DocumentService
from .embedding_service import EmbeddingService
from .llm_service import LLMService

__all__ = [
    # Chunking service (unified)
    "ChunkingService",
    "SemanticChunk",
    "ChunkMetadata",
    "TokenChunk",
    "OverlapConfig",
    "OverlapOptimizer",
    "OverlapStrategy",
    "OverlapRegion",
    "OverlapStatistics",
    "BoundaryType",
    "BoundaryDetector",
    "ReadabilityAnalyzer",
    "SplitStrategy",
    "Tokenizer",
    "TiktokenTokenizer",
    "TransformersTokenizer",
    "SimpleTokenizer",
    # Document services
    "DocumentService",
    "EmbeddingService",
    "LLMService",
]
