import pathlib
from typing import List
from app.core.logger import logger

def load_pdfs(path: str) -> List[pathlib.Path]:
    """
    Recursively loads all PDF files from the given path.
    Ref: https://docs.python.org/3/library/pathlib.html
    """
    base_path = pathlib.Path(path)
    
    # Resolve to absolute path for clarity in logs
    try:
        abs_path = base_path.resolve()
    except Exception:
        # Fallback if path doesn't exist yet but might be relative
        abs_path = base_path.absolute()

    if not base_path.exists():
        logger.error(f"Provided path does not exist: {abs_path}")
        return []

    logger.info(f"Scanning for PDFs in: {abs_path}")
    
    # Recursively find all .pdf files
    pdf_files = list(base_path.rglob("*.pdf"))
    
    # Filter out hidden files just in case
    pdf_files = [p for p in pdf_files if not p.name.startswith(".")]
    
    logger.info(f"Found {len(pdf_files)} PDF files.")
    return pdf_files
