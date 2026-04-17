"""Text processing utilities for PDF and document text cleaning."""

import re
from typing import Optional


def clean_text(
    text: str,
    remove_urls: bool = True,
    remove_emails: bool = True,
    normalize_unicode: bool = True,
    preserve_structure: bool = True
) -> str:
    """
    Clean and normalize text from PDF or document extraction.
    
    Performs comprehensive cleaning including:
    - Removes excessive newlines (keeps single blank lines for structure)
    - Normalizes whitespace and spaces
    - Strips unwanted characters and control sequences
    - Preserves readability and document structure
    - Optional URL and email removal
    - Optional Unicode normalization
    
    Args:
        text: Raw text (typically from PDF extraction)
        remove_urls: Remove URLs (default True)
        remove_emails: Remove email addresses (default True)
        normalize_unicode: Normalize Unicode characters (default True)
        preserve_structure: Keep paragraph structure with single blank lines (default True)
        
    Returns:
        Cleaned and normalized text
        
    Example:
        >>> raw_text = "Page 1\\n\\n\\n\\nSome   text   with\\t\\ttabs"
        >>> clean_text(raw_text)
        'Page 1\\n\\nSome text with tabs'
    """
    if not text or not isinstance(text, str):
        return ""
    
    # Step 1: Remove URLs if requested
    if remove_urls:
        text = _remove_urls(text)
    
    # Step 2: Remove email addresses if requested
    if remove_emails:
        text = _remove_emails(text)
    
    # Step 3: Normalize Unicode characters
    if normalize_unicode:
        text = _normalize_unicode(text)
    
    # Step 4: Remove control characters and unusual whitespace
    text = _remove_control_characters(text)
    
    # Step 5: Replace multiple spaces with single space
    text = _normalize_spaces(text)
    
    # Step 6: Handle excessive newlines while preserving structure
    if preserve_structure:
        text = _normalize_newlines_preserve_structure(text)
    else:
        text = _normalize_newlines(text)
    
    # Step 7: Strip leading/trailing whitespace
    text = text.strip()
    
    return text


def _remove_urls(text: str) -> str:
    """Remove URLs from text."""
    # Pattern for URLs
    url_pattern = r'https?://[^\s]+'
    return re.sub(url_pattern, '', text)


def _remove_emails(text: str) -> str:
    """Remove email addresses from text."""
    # Pattern for email addresses
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    return re.sub(email_pattern, '', text)


def _normalize_unicode(text: str) -> str:
    """Normalize Unicode characters (decompose and clean)."""
    import unicodedata
    # Normalize to NFKC form (compatibility decomposition)
    text = unicodedata.normalize('NFKC', text)
    return text


def _remove_control_characters(text: str) -> str:
    """Remove control characters and unusual whitespace."""
    # Remove control characters (ASCII 0-31 except newline, tab)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    
    # Replace form feeds, vertical tabs with spaces
    text = text.replace('\f', ' ')
    text = text.replace('\v', ' ')
    
    # Remove zero-width characters
    text = text.replace('\u200b', '')  # Zero-width space
    text = text.replace('\u200c', '')  # Zero-width non-joiner
    text = text.replace('\u200d', '')  # Zero-width joiner
    
    return text


def _normalize_spaces(text: str) -> str:
    """Normalize whitespace: replace tabs and multiple spaces with single space."""
    # Replace tabs with spaces
    text = text.replace('\t', ' ')
    
    # Replace multiple spaces with single space (but not newlines)
    text = re.sub(r' +', ' ', text)
    
    return text


def _normalize_newlines(text: str) -> str:
    """Remove excessive newlines, keep single newlines."""
    # Replace 3+ newlines with 2 newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text


def _normalize_newlines_preserve_structure(text: str) -> str:
    """Remove excessive newlines while preserving paragraph structure."""
    # First, replace multiple newlines (3+) with double newline (paragraph break)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Handle Windows line endings first
    text = text.replace('\r\n', '\n')
    text = text.replace('\r', '\n')
    
    # Handle lines that end with hyphen (continuation)
    # E.g., "word-\n" becomes "word" (remove hyphen and newline)
    text = re.sub(r'-\n', '', text)
    
    # Join lines that should be continuous (single newline between text)
    # But preserve double newlines (paragraph breaks)
    lines = text.split('\n')
    cleaned_lines = []
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        if not stripped:
            # Empty line
            if cleaned_lines and cleaned_lines[-1] != '':
                cleaned_lines.append('')  # Keep single empty line for structure
        else:
            # Non-empty line
            cleaned_lines.append(stripped)
    
    # Remove consecutive empty lines (keep max 1 empty line between content)
    result_lines = []
    prev_empty = False
    for line in cleaned_lines:
        if not line:  # Empty line
            if not prev_empty:
                result_lines.append(line)
            prev_empty = True
        else:  # Non-empty line
            result_lines.append(line)
            prev_empty = False
    
    return '\n'.join(result_lines)


def clean_pdf_text(text: str) -> str:
    """
    Specialized cleaning for PDF-extracted text.
    
    PDFs often produce:
    - Page breaks as multiple newlines
    - Hyphenated words split across lines
    - Extra spaces and tabs
    - Unusual Unicode characters
    
    This function handles these common PDF extraction issues.
    
    Args:
        text: Raw PDF text
        
    Returns:
        Cleaned text suitable for processing
    """
    return clean_text(
        text,
        remove_urls=True,
        remove_emails=False,  # Keep emails in documents
        normalize_unicode=True,
        preserve_structure=True
    )


def remove_excessive_newlines(text: str, max_consecutive: int = 1) -> str:
    """
    Remove excessive consecutive newlines.
    
    Args:
        text: Input text
        max_consecutive: Maximum consecutive newlines to keep (default 1, means 2 newlines)
        
    Returns:
        Text with normalized newlines
        
    Example:
        >>> text = "Line 1\\n\\n\\n\\nLine 2"
        >>> remove_excessive_newlines(text, max_consecutive=1)
        'Line 1\\n\\nLine 2'
    """
    # Create pattern for 3+ newlines
    pattern = r'\n{' + str(max_consecutive + 2) + r',}'
    replacement = '\n' * (max_consecutive + 1)
    return re.sub(pattern, replacement, text)


def normalize_whitespace(text: str, preserve_newlines: bool = True) -> str:
    """
    Normalize whitespace in text.
    
    Args:
        text: Input text
        preserve_newlines: Keep newlines as structure (default True)
        
    Returns:
        Text with normalized whitespace
    """
    if preserve_newlines:
        # Process line by line
        lines = text.split('\n')
        cleaned_lines = [_normalize_spaces(line) for line in lines]
        return '\n'.join(cleaned_lines)
    else:
        # Replace all whitespace with spaces, then normalize
        text = ' '.join(text.split())
        return text


def remove_special_characters(
    text: str,
    keep_punctuation: bool = True,
    keep_digits: bool = True
) -> str:
    """
    Remove special characters while preserving readability.
    
    Args:
        text: Input text
        keep_punctuation: Keep punctuation marks (default True)
        keep_digits: Keep digit characters (default True)
        
    Returns:
        Text with special characters removed
    """
    if keep_punctuation and keep_digits:
        # Keep alphanumeric, spaces, newlines, and common punctuation
        pattern = r'[^a-zA-Z0-9\s\n\-.,!?\'";:]'
    elif keep_punctuation:
        # Keep letters, spaces, newlines, and punctuation
        pattern = r'[^a-zA-Z\s\n\-.,!?\'";:]'
    elif keep_digits:
        # Keep alphanumeric, spaces, newlines
        pattern = r'[^a-zA-Z0-9\s\n]'
    else:
        # Keep only letters, spaces, newlines
        pattern = r'[^a-zA-Z\s\n]'
    
    return re.sub(pattern, '', text)


def split_text(text: str, chunk_size: int = 500) -> list[str]:
    """
    Split text into chunks by character count.
    
    Args:
        text: Input text
        chunk_size: Size of each chunk
        
    Returns:
        List of text chunks
    """
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks


def split_text_by_paragraphs(text: str, min_paragraph_size: int = 0) -> list[str]:
    """
    Split text into paragraphs (separated by blank lines).
    
    Args:
        text: Input text
        min_paragraph_size: Minimum paragraph length to include (default 0)
        
    Returns:
        List of paragraphs
    """
    # Split by double newline
    paragraphs = text.split('\n\n')
    
    # Filter out empty or too-small paragraphs
    filtered = [p.strip() for p in paragraphs if len(p.strip()) > min_paragraph_size]
    
    return filtered


def split_text_by_sentences(text: str) -> list[str]:
    """
    Split text into sentences.
    
    Args:
        text: Input text
        
    Returns:
        List of sentences
    """
    # Basic sentence splitting on periods, question marks, exclamation marks
    # Handles common cases but not perfect for all edge cases
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]


def tokenize(text: str) -> list[str]:
    """
    Tokenize text into words.
    
    Args:
        text: Input text
        
    Returns:
        List of tokens (words)
    """
    # Split on whitespace and remove empty strings
    return [token for token in text.split() if token]
