import fitz  # PyMuPDF
import numpy as np
from app.core.logger import logger
from typing import List

try:
    import easyocr
except ImportError:
    easyocr = None
    logger.warning("EasyOCR module not found. OCR capabilities will be disabled.")

class OCRProcessor:
    def __init__(self, lang_list: List[str] = ['en']):
        """
        Initialize the OCR Processor with EasyOCR.
        Args:
            lang_list (List[str]): List of languages for OCR. Default is ['en'].
        """
        try:
            logger.info(f"Initializing EasyOCR with languages: {lang_list}")
            # easyocr.Reader loads model into memory
            self.reader = easyocr.Reader(lang_list) 
        except Exception as e:
            logger.error(f"Failed to initialize EasyOCR: {e}. OCR will be skipped.")
            self.reader = None

    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """
        Extract text from a PDF by converting pages to images and running OCR.
        """
        if not self.reader:
            logger.warning("OCR is disabled due to initialization failure.")
            return ""

        logger.info(f"Starting OCR processing for: {pdf_path}")
        full_text = []

        try:
            doc = fitz.open(pdf_path)
            total_pages = len(doc)
            
            for page_num in range(total_pages):
                try:
                    page = doc.load_page(page_num)
                    
                    # Convert page to image (pixmap)
                    # zoom_x, zoom_y = 2.0, 2.0  # Higher resolution for better OCR
                    # mat = fitz.Matrix(zoom_x, zoom_y)
                    # pix = page.get_pixmap(matrix=mat)
                    pix = page.get_pixmap() # Default is usually sufficient and faster
                    
                    # Convert to numpy array for EasyOCR
                    img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
                    
                    # If alpha channel exists, drop it
                    if pix.n == 4:
                        img_data = img_data[:, :, :3]
                    
                    # Run OCR
                    # detail=0 returns just the list of text strings
                    result = self.reader.readtext(img_data, detail=0, paragraph=True)
                    
                    page_text = "\n".join(result)
                    full_text.append(page_text)
                    
                    # logger.info(f"OCR Page {page_num+1}/{total_pages} complete.")

                except Exception as e:
                    logger.error(f"OCR failed for page {page_num} of {pdf_path}: {e}")
                    continue
            
            doc.close()
            combined_text = "\n\n".join(full_text)
            logger.info(f"OCR completed. Extracted {len(combined_text)} characters.")
            return combined_text

        except Exception as e:
            logger.error(f"Failed to process PDF for OCR: {e}")
            return ""

# Global instance lazy loader (optional, but good for keeping main clean)
_ocr_processor = None

def get_ocr_processor():
    global _ocr_processor
    if _ocr_processor is None:
        _ocr_processor = OCRProcessor()
    return _ocr_processor
