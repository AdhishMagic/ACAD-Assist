"""File utility functions shared across services."""

import os
from pathlib import Path


def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lstrip(".")


def get_file_size_mb(file_path: str) -> float:
    return os.path.getsize(file_path) / (1024 * 1024)


def ensure_directory(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def safe_filename(filename: str) -> str:
    keepcharacters = (" ", ".", "_", "-")
    return "".join(c for c in filename if c.isalnum() or c in keepcharacters).strip()
