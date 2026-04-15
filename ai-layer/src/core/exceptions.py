"""Custom exception classes."""


class AILayerException(Exception):
    """Base exception for AI Layer."""
    pass


class DocumentProcessingError(AILayerException):
    """Raised when document processing fails."""
    pass


class EmbeddingError(AILayerException):
    """Raised when embedding generation fails."""
    pass


class LLMError(AILayerException):
    """Raised when LLM call fails."""
    pass
