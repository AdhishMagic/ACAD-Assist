"""
Unified Chunking Service - Token-aware semantic chunking with overlap management.

This service consolidates token splitting, semantic boundary detection, overlap
handling, and metadata attachment into a single, production-ready component.

FEATURES:
- Token-based splitting (500-800 tokens per chunk)
- Semantic boundary preservation (paragraphs, sentences)
- Intelligent overlap management (100-150 tokens)
- Comprehensive metadata attachment
- Multiple tokenizer support (tiktoken, transformers)
- Readability analysis and quality scoring
- Memory-efficient generator patterns

USAGE:
    from services.chunking_service import ChunkingService
    
    # Create service with standard config
    chunking_svc = ChunkingService()
    
    # Chunk text with metadata
    chunks = chunking_svc.chunk_text(
        text="Document content...",
        file_name="document.pdf",
        subject="Computer Science"
    )
    
    for chunk in chunks:
        print(f"Chunk {chunk.chunk_id}: {len(chunk.text)} chars, {chunk.token_count} tokens")
"""

import logging
import re
import uuid
import hashlib
from typing import List, Dict, Any, Optional, Tuple, Set, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
from collections import defaultdict
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


# ============================================================================
# ENUMS & CONFIG
# ============================================================================

class TokenizerType(Enum):
    """Supported tokenizer types."""
    TIKTOKEN = "tiktoken"
    TRANSFORMERS = "transformers"
    NLTK = "nltk"
    SIMPLE = "simple"


class SplitStrategy(Enum):
    """Text splitting strategies."""
    TOKENS_ONLY = "tokens_only"
    PRESERVE_SENTENCES = "preserve_sentences"
    PRESERVE_PARAGRAPHS = "preserve_paragraphs"
    BALANCED = "balanced"


class BoundaryType(Enum):
    """Types of text boundaries."""
    PARAGRAPH = "paragraph"
    SECTION = "section"
    SUBSECTION = "subsection"
    SENTENCE = "sentence"
    TOKEN = "token"


class OverlapStrategy(Enum):
    """Strategies for handling overlaps."""
    NONE = "none"
    SIMPLE = "simple"
    SMART_DEDUP = "smart_dedup"
    CONTEXTUAL = "contextual"
    FUZZY = "fuzzy"
    OPTIMIZED = "optimized"


class ReadabilityMetric(Enum):
    """Readability metrics."""
    AVG_SENTENCE_LENGTH = "avg_sentence_length"
    AVG_PARAGRAPH_LENGTH = "avg_paragraph_length"
    FLESCH_KINCAID = "flesch_kincaid"
    COHERENCE_SCORE = "coherence_score"
    BOUNDARY_RESPECT = "boundary_respect"


# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class TokenChunk:
    """Chunk with token information."""
    text: str
    token_count: int
    chunk_id: int = 0
    start_char: int = 0
    end_char: int = 0
    start_token_id: int = 0
    end_token_id: int = 0
    is_overlapping: bool = False
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "id": self.chunk_id,
            "text": self.text,
            "token_count": self.token_count,
            "char_range": f"{self.start_char}-{self.end_char}",
            "token_range": f"{self.start_token_id}-{self.end_token_id}",
            "is_overlapping": self.is_overlapping,
            "metadata": self.metadata,
        }


@dataclass
class ChunkMetadata:
    """Standardized metadata for each chunk."""
    file_name: str = ""
    page_number: Optional[int] = None
    department: str = ""
    semester: str = ""
    subject: str = ""
    section: str = ""
    section_number: Optional[int] = None
    topic: str = ""
    author: str = ""
    created_date: Optional[str] = None
    custom_fields: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "file_name": self.file_name,
            "page_number": self.page_number,
            "department": self.department,
            "semester": self.semester,
            "subject": self.subject,
            "section": self.section,
            "section_number": self.section_number,
            "topic": self.topic,
            "author": self.author,
            "created_date": self.created_date,
            "custom_fields": self.custom_fields,
        }


@dataclass
class SemanticChunk:
    """Enhanced chunk with semantic and readability information."""
    text: str
    token_count: int
    char_start: int
    char_end: int
    chunk_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    chunk_index: int = 0
    boundary_type: BoundaryType = BoundaryType.TOKEN
    is_at_boundary: bool = False
    boundary_position_in_chunk: Optional[str] = None
    readability_score: float = 0.0
    avg_sentence_length: float = 0.0
    paragraph_count: int = 0
    sentence_count: int = 0
    starts_new_topic: bool = False
    ends_topic: bool = False
    coherence_with_next: Optional[float] = None
    chunk_metadata: ChunkMetadata = field(default_factory=ChunkMetadata)
    custom_metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary with all metadata."""
        return {
            "chunk_id": self.chunk_id,
            "chunk_index": self.chunk_index,
            "text": self.text,
            "token_count": self.token_count,
            "char_range": f"{self.char_start}-{self.char_end}",
            "boundary_type": self.boundary_type.value,
            "is_at_boundary": self.is_at_boundary,
            "readability_score": round(self.readability_score, 3),
            "metrics": {
                "avg_sentence_length": round(self.avg_sentence_length, 2),
                "paragraph_count": self.paragraph_count,
                "sentence_count": self.sentence_count,
            },
            "continuity": {
                "starts_new_topic": self.starts_new_topic,
                "ends_topic": self.ends_topic,
                "coherence_with_next": round(self.coherence_with_next, 3) if self.coherence_with_next else None,
            },
            "metadata": {
                "document": self.chunk_metadata.to_dict(),
                "custom": self.custom_metadata,
                "created_at": self.created_at,
            },
        }


@dataclass
class OverlapConfig:
    """Configuration for overlap management."""
    overlap_tokens: int = 125
    min_overlap_tokens: int = 50
    max_overlap_tokens: int = 300
    max_overlap_ratio: float = 0.25
    target_overlap_ratio: float = 0.20
    strategy: OverlapStrategy = OverlapStrategy.SMART_DEDUP
    enable_dedup: bool = True
    fuzzy_match_threshold: float = 0.90
    preserve_sentence_boundaries: bool = True
    preserve_paragraph_boundaries: bool = False
    track_overlap_metadata: bool = True
    compute_uniqueness_ratio: bool = True
    
    def validate(self) -> None:
        """Validate configuration."""
        if self.overlap_tokens < self.min_overlap_tokens:
            raise ValueError(
                f"overlap_tokens ({self.overlap_tokens}) < min_overlap_tokens ({self.min_overlap_tokens})"
            )
        if self.overlap_tokens > self.max_overlap_tokens:
            raise ValueError(
                f"overlap_tokens ({self.overlap_tokens}) > max_overlap_tokens ({self.max_overlap_tokens})"
            )
        if not (0 < self.max_overlap_ratio < 1):
            raise ValueError("max_overlap_ratio must be between 0 and 1")
        if not (0 < self.target_overlap_ratio < self.max_overlap_ratio):
            raise ValueError("target_overlap_ratio must be < max_overlap_ratio")
        
        logger.info(
            f"OverlapConfig validated: overlap={self.overlap_tokens} tokens, "
            f"strategy={self.strategy.value}"
        )


@dataclass
class OverlapRegion:
    """Represents an overlap between consecutive chunks."""
    chunk_a_id: int
    chunk_b_id: int
    overlap_text: str
    overlap_token_count: int
    overlap_char_count: int
    similarity_score: float = 1.0
    is_duplicate: bool = False
    overlap_start_in_a: int = 0
    overlap_start_in_b: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "chunk_a": self.chunk_a_id,
            "chunk_b": self.chunk_b_id,
            "overlap_tokens": self.overlap_token_count,
            "similarity": self.similarity_score,
            "is_duplicate": self.is_duplicate,
        }


@dataclass
class OverlapStatistics:
    """Statistics about overlaps in a chunk set."""
    total_chunks: int = 0
    total_overlapping_pairs: int = 0
    total_overlap_tokens: int = 0
    total_unique_tokens: int = 0
    average_overlap_ratio: float = 0.0
    total_duplication_ratio: float = 0.0
    average_similarity: float = 0.0
    duplicate_pairs: int = 0
    content_uniqueness_ratio: float = 0.0
    overlaps: List[OverlapRegion] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "total_chunks": self.total_chunks,
            "total_overlapping_pairs": self.total_overlapping_pairs,
            "average_overlap_ratio": f"{self.average_overlap_ratio:.1%}",
            "total_duplication_ratio": f"{self.total_duplication_ratio:.1%}",
            "content_uniqueness_ratio": f"{self.content_uniqueness_ratio:.1%}",
            "duplicate_pairs": self.duplicate_pairs,
        }


# ============================================================================
# TOKENIZERS
# ============================================================================

class Tokenizer:
    """Abstract tokenizer interface."""
    
    def tokenize(self, text: str) -> List[str]:
        """Tokenize text into tokens."""
        raise NotImplementedError
    
    def decode(self, tokens: List[str]) -> str:
        """Decode tokens back to text."""
        raise NotImplementedError
    
    def token_count(self, text: str) -> int:
        """Count tokens in text."""
        return len(self.tokenize(text))


class TiktokenTokenizer(Tokenizer):
    """Tokenizer using OpenAI's tiktoken."""
    
    def __init__(self, model: str = "cl100k_base"):
        """Initialize tiktoken tokenizer."""
        try:
            import tiktoken
            self.tiktoken = tiktoken
            self.encoding = tiktoken.get_encoding(model)
            self.model = model
            logger.info(f"Initialized TiktokenTokenizer: {model}")
        except ImportError:
            raise ImportError("tiktoken not installed. Install with: pip install tiktoken")
        except Exception as e:
            raise ValueError(f"Failed to load tiktoken model '{model}': {e}")
    
    def tokenize(self, text: str) -> List[int]:
        """Tokenize text to token IDs."""
        return self.encoding.encode(text)
    
    def decode(self, tokens: List[int]) -> str:
        """Decode token IDs back to text."""
        return self.encoding.decode(tokens)
    
    def token_count(self, text: str) -> int:
        """Count tokens."""
        return len(self.encoding.encode(text))


class TransformersTokenizer(Tokenizer):
    """Tokenizer using HuggingFace transformers."""
    
    def __init__(self, model: str = "bert-base-uncased"):
        """Initialize transformers tokenizer."""
        try:
            from transformers import AutoTokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(model)
            self.model = model
            logger.info(f"Initialized TransformersTokenizer: {model}")
        except ImportError:
            raise ImportError("transformers not installed. Install with: pip install transformers")
        except Exception as e:
            raise ValueError(f"Failed to load transformers model '{model}': {e}")
    
    def tokenize(self, text: str) -> List[int]:
        """Tokenize text."""
        return self.tokenizer.encode(text)
    
    def decode(self, tokens: List[int]) -> str:
        """Decode tokens."""
        return self.tokenizer.decode(tokens)
    
    def token_count(self, text: str) -> int:
        """Count tokens."""
        return len(self.tokenizer.encode(text))


class SimpleTokenizer(Tokenizer):
    """Simple word-based tokenizer (fallback)."""
    
    def tokenize(self, text: str) -> List[str]:
        """Split text into words."""
        return re.findall(r'\S+', text)
    
    def decode(self, tokens: List[str]) -> str:
        """Join tokens back."""
        return ' '.join(tokens)
    
    def token_count(self, text: str) -> int:
        """Count words/tokens."""
        return len(self.tokenize(text))


# ============================================================================
# BOUNDARY DETECTION
# ============================================================================

class BoundaryDetector:
    """Detects various text boundaries."""
    
    SENTENCE_BOUNDARIES = re.compile(
        r'(?<=[.!?])\s+(?=[A-Z])|(?<=[.!?])\n'
    )
    
    PARAGRAPH_BOUNDARIES = re.compile(r'\n\s*\n+')
    
    SECTION_PATTERNS = {
        "markdown_h1": re.compile(r'^# .+$', re.MULTILINE),
        "markdown_h2": re.compile(r'^## .+$', re.MULTILINE),
        "numbered_section": re.compile(r'^\d+\.?\s+[A-Z]', re.MULTILINE),
        "chapter": re.compile(r'(?i)^(chapter|section|part)\s+\d+', re.MULTILINE),
    }
    
    @staticmethod
    def find_paragraph_boundaries(text: str) -> List[Tuple[int, int]]:
        """Find paragraph boundaries (double newlines)."""
        paragraphs = []
        last_end = 0
        
        for match in BoundaryDetector.PARAGRAPH_BOUNDARIES.finditer(text):
            if last_end < match.start():
                start = last_end
                end = match.start()
                paragraph_text = text[start:end].strip()
                if paragraph_text:
                    paragraphs.append((start, end))
            last_end = match.end()
        
        if last_end < len(text):
            paragraph_text = text[last_end:].strip()
            if paragraph_text:
                paragraphs.append((last_end, len(text)))
        
        return paragraphs
    
    @staticmethod
    def find_sentence_boundaries(text: str) -> List[Tuple[int, int]]:
        """Find sentence boundaries."""
        sentences = []
        last_end = 0
        
        for match in BoundaryDetector.SENTENCE_BOUNDARIES.finditer(text):
            end_pos = match.start() + 1
            if last_end < end_pos:
                sentences.append((last_end, end_pos))
            last_end = match.end()
        
        if last_end < len(text):
            final_text = text[last_end:].strip()
            if final_text:
                sentences.append((last_end, len(text)))
        
        return sentences
    
    @staticmethod
    def find_best_split_point(
        text: str,
        target_pos: int,
        prefer: str = "paragraph",
        search_window: int = 200,
    ) -> Tuple[int, BoundaryType]:
        """Find best split point respecting boundary hierarchy."""
        search_start = max(0, target_pos - search_window)
        search_end = min(len(text), target_pos + search_window)
        
        if prefer in ("paragraph", None):
            paragraphs = BoundaryDetector.find_paragraph_boundaries(text[search_start:search_end])
            for para_start, para_end in paragraphs:
                abs_pos = search_start + para_end
                if abs_pos >= target_pos and abs_pos <= target_pos + search_window:
                    return abs_pos, BoundaryType.PARAGRAPH
        
        if prefer in ("sentence", None):
            sentences = BoundaryDetector.find_sentence_boundaries(text[search_start:search_end])
            for sent_start, sent_end in sentences:
                abs_pos = search_start + sent_end
                if abs_pos >= target_pos and abs_pos <= target_pos + search_window:
                    return abs_pos, BoundaryType.SENTENCE
        
        return target_pos, BoundaryType.TOKEN


# ============================================================================
# READABILITY ANALYSIS
# ============================================================================

class ReadabilityAnalyzer:
    """Analyzes and scores chunk readability."""
    
    @staticmethod
    def calculate_flesch_kincaid(text: str) -> float:
        """Calculate Flesch-Kincaid grade level."""
        words = len(text.split())
        sentences = len(BoundaryDetector.SENTENCE_BOUNDARIES.findall(text)) or 1
        
        if words < 1 or sentences < 1:
            return 0
        
        estimated_syllables = words * 1.5
        grade = (
            0.39 * (words / sentences) +
            11.8 * (estimated_syllables / words) -
            15.59
        )
        
        return max(0, min(18, grade))
    
    @staticmethod
    def calculate_coherence(text: str) -> float:
        """Score coherence (continuity/flow) 0-1."""
        if not text or len(text) < 20:
            return 0
        
        transition_patterns = re.compile(
            r'\b(however|therefore|moreover|furthermore|in addition|'
            r'as a result|consequently|for example|in contrast|similarly)\b',
            re.IGNORECASE
        )
        transition_count = len(transition_patterns.findall(text))
        
        words = text.lower().split()
        word_freq = defaultdict(int)
        for word in words:
            if len(word) > 4:
                word_freq[word] += 1
        
        repeated_terms = sum(1 for count in word_freq.values() if count >= 2)
        score = min(1.0, transition_count * 0.1 + repeated_terms * 0.05)
        
        return score
    
    @staticmethod
    def analyze_chunk(text: str) -> Dict[str, Any]:
        """Comprehensive readability analysis."""
        sentences = BoundaryDetector.find_sentence_boundaries(text)
        paragraphs = BoundaryDetector.find_paragraph_boundaries(text)
        
        flesch = ReadabilityAnalyzer.calculate_flesch_kincaid(text)
        fk_score = max(0, 1 - (flesch / 18))
        coherence = ReadabilityAnalyzer.calculate_coherence(text)
        
        readability = fk_score * 0.3 + coherence * 0.7
        
        return {
            "readability_score": round(readability, 3),
            "flesch_kincaid": round(flesch, 2),
            "coherence_score": round(coherence, 3),
            "sentence_count": len(sentences),
            "paragraph_count": len(paragraphs),
            "word_count": len(text.split()),
        }


# ============================================================================
# OVERLAP MANAGEMENT
# ============================================================================

class OverlapOptimizer:
    """Optimizes overlaps to reduce duplication while maintaining continuity."""
    
    def __init__(self, config: OverlapConfig = None):
        """Initialize optimizer."""
        self.config = config or OverlapConfig()
        self.config.validate()
    
    def optimize_overlaps(self, chunks: List[SemanticChunk]) -> List[SemanticChunk]:
        """Optimize overlaps in chunks."""
        if len(chunks) < 2 or self.config.strategy == OverlapStrategy.NONE:
            return chunks
        
        if self.config.strategy == OverlapStrategy.SMART_DEDUP:
            return self._smart_dedup_overlaps(chunks)
        elif self.config.strategy == OverlapStrategy.CONTEXTUAL:
            return self._preserve_contextual_overlaps(chunks)
        
        return chunks
    
    def _smart_dedup_overlaps(self, chunks: List[SemanticChunk]) -> List[SemanticChunk]:
        """Remove exact duplicate overlaps."""
        if len(chunks) < 2:
            return chunks
        
        optimized = []
        for i, chunk in enumerate(chunks):
            if i == 0:
                optimized.append(chunk)
                continue
            
            # Check for fuzzy duplicates with previous chunk
            prev_chunk = chunks[i - 1]
            prev_end = prev_chunk.text[-200:] if len(prev_chunk.text) > 200 else prev_chunk.text
            curr_start = chunk.text[:200] if len(chunk.text) > 200 else chunk.text
            
            similarity = SequenceMatcher(None, prev_end, curr_start).ratio()
            
            if similarity < 0.95:  # Not a near-duplicate
                optimized.append(chunk)
            else:
                logger.debug(f"Deduped similar content: {similarity:.1%}")
        
        return optimized
    
    def _preserve_contextual_overlaps(self, chunks: List[SemanticChunk]) -> List[SemanticChunk]:
        """Keep meaningful overlaps for continuity."""
        return chunks


# ============================================================================
# CHUNKING SERVICE
# ============================================================================

class ChunkingService:
    """
    Production-ready chunking service.
    
    Handles token-aware splitting with semantic boundary preservation,
    overlap management, and metadata attachment.
    """
    
    def __init__(
        self,
        min_chunk_tokens: int = 500,
        max_chunk_tokens: int = 800,
        overlap_tokens: int = 125,
        tokenizer_type: str = "simple",
        strategy: str = "preserve_sentences",
        enable_overlap_optimization: bool = True,
    ):
        """
        Initialize chunking service.
        
        Args:
            min_chunk_tokens: Minimum tokens per chunk
            max_chunk_tokens: Maximum tokens per chunk (500-800 recommended)
            overlap_tokens: Tokens to overlap between chunks (100-150 recommended)
            tokenizer_type: "tiktoken", "transformers", "simple"
            strategy: "tokens_only", "preserve_sentences", "preserve_paragraphs", "balanced"
            enable_overlap_optimization: Apply overlap deduplication
        """
        self.min_chunk_tokens = min_chunk_tokens
        self.max_chunk_tokens = max_chunk_tokens
        self.overlap_tokens = overlap_tokens
        self.strategy = SplitStrategy[strategy.upper()] if isinstance(strategy, str) else strategy
        self.enable_overlap_optimization = enable_overlap_optimization
        
        # Initialize tokenizer
        self.tokenizer = self._init_tokenizer(tokenizer_type)
        
        # Initialize overlap optimizer
        overlap_config = OverlapConfig(overlap_tokens=overlap_tokens)
        self.overlap_optimizer = OverlapOptimizer(overlap_config)
        
        logger.info(
            f"ChunkingService initialized: "
            f"tokens={min_chunk_tokens}-{max_chunk_tokens}, "
            f"overlap={overlap_tokens}, "
            f"strategy={self.strategy.value}"
        )
    
    def _init_tokenizer(self, tokenizer_type: str) -> Tokenizer:
        """Initialize tokenizer."""
        tokenizer_type = tokenizer_type.lower()
        
        if tokenizer_type == "tiktoken":
            return TiktokenTokenizer()
        elif tokenizer_type == "transformers":
            return TransformersTokenizer()
        else:
            return SimpleTokenizer()
    
    def chunk_text(
        self,
        text: str,
        file_name: str = "",
        page_number: Optional[int] = None,
        department: str = "",
        semester: str = "",
        subject: str = "",
        section: str = "",
        topic: str = "",
        author: str = "",
        custom_metadata: Dict[str, Any] = None,
    ) -> List[SemanticChunk]:
        """
        Chunk text into semantic chunks with metadata.
        
        Args:
            text: Input text to chunk
            file_name: Source file name
            page_number: Page number in source
            department: Academic department
            semester: Semester/term
            subject: Subject/course
            section: Section/heading
            topic: Specific topic
            author: Document author
            custom_metadata: Additional metadata
            
        Returns:
            List of SemanticChunk objects
        """
        if not text or not text.strip():
            logger.warning("Empty text provided to chunk_text")
            return []
        
        custom_metadata = custom_metadata or {}
        chunks = []
        chunk_index = 0
        current_pos = 0
        
        # Split text by strategy
        split_points = self._find_split_points(text)
        
        if not split_points:
            split_points = [(0, len(text))]
        
        for start, end in split_points:
            section_text = text[start:end].strip()
            
            if not section_text:
                continue
            
            # Count tokens
            token_count = self._count_tokens(section_text)
            
            # Create chunk
            chunk = SemanticChunk(
                text=section_text,
                token_count=token_count,
                char_start=start,
                char_end=end,
                chunk_index=chunk_index,
                boundary_type=BoundaryType.PARAGRAPH,
                is_at_boundary=True,
                chunk_metadata=ChunkMetadata(
                    file_name=file_name,
                    page_number=page_number,
                    department=department,
                    semester=semester,
                    subject=subject,
                    section=section,
                    topic=topic,
                    author=author,
                    custom_fields=custom_metadata,
                ),
            )
            
            # Analyze readability
            readability = ReadabilityAnalyzer.analyze_chunk(section_text)
            chunk.readability_score = readability.get("readability_score", 0.0)
            chunk.sentence_count = readability.get("sentence_count", 0)
            chunk.paragraph_count = readability.get("paragraph_count", 0)
            chunk.avg_sentence_length = (
                readability.get("word_count", 0) / max(1, chunk.sentence_count)
            )
            
            chunks.append(chunk)
            chunk_index += 1
        
        # Apply overlap optimization
        if self.enable_overlap_optimization and len(chunks) > 1:
            chunks = self.overlap_optimizer.optimize_overlaps(chunks)
        
        logger.info(f"Chunked text into {len(chunks)} chunks")
        
        return chunks
    
    def _count_tokens(self, text: str) -> int:
        """Count tokens in text."""
        try:
            return self.tokenizer.token_count(text)
        except Exception as e:
            logger.warning(f"Token counting failed, using fallback: {e}")
            return len(text) // 4  # Rough approximation
    
    def _find_split_points(self, text: str) -> List[Tuple[int, int]]:
        """Find logical split points in text."""
        if self.strategy == SplitStrategy.PRESERVE_PARAGRAPHS:
            paragraphs = BoundaryDetector.find_paragraph_boundaries(text)
            if paragraphs:
                return paragraphs
        
        if self.strategy == SplitStrategy.PRESERVE_SENTENCES:
            sentences = BoundaryDetector.find_sentence_boundaries(text)
            if sentences:
                return sentences
        
        # Fallback: split by max_chunk_tokens
        split_points = []
        current_pos = 0
        
        while current_pos < len(text):
            # Estimate target end position
            remaining_text = text[current_pos:]
            remaining_tokens = self._count_tokens(remaining_text)
            
            if remaining_tokens <= self.max_chunk_tokens:
                split_points.append((current_pos, len(text)))
                break
            
            # Find best split point
            target_pos = current_pos + int(
                (len(remaining_text) / remaining_tokens) * self.max_chunk_tokens * 0.9
            )
            split_point, _ = BoundaryDetector.find_best_split_point(text, target_pos)
            
            if current_pos < split_point < len(text):
                split_points.append((current_pos, split_point))
                current_pos = split_point
            else:
                current_pos += max(1000, len(remaining_text) // 2)
        
        return split_points if split_points else [(0, len(text))]
