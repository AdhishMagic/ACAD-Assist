"""File handling utilities."""

from typing import Optional


def read_file(filepath: str) -> Optional[str]:
    """
    Read a file.
    
    Args:
        filepath: Path to file
        
    Returns:
        File content or None
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return None


def write_file(filepath: str, content: str) -> bool:
    """
    Write content to a file.
    
    Args:
        filepath: Path to file
        content: Content to write
        
    Returns:
        Success status
    """
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error writing file: {e}")
        return False
