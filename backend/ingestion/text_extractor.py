from typing import Optional
from langchain_community.document_loaders import PyPDFLoader
from app.core.logger import logger
from ingestion.ocr_processor import get_ocr_processor

class TextExtractor:
    def process_pdf(self, pdf_path: str, min_text_length: int = 50) -> str:
        """
        Extracts text from a PDF.
        Strategy:
        1. Attempt standard extraction with PyPDFLoader.
        2. If extracted text is too short or empty, fallback to OCR.
        """
        extracted_text = ""
        used_ocr = False
        
        # Method 1: PyPDFLoader (Standard)
        try:
            loader = PyPDFLoader(str(pdf_path))
            pages = loader.load()
            
            # Combine text from all pages
            extracted_text = "\n".join([p.page_content for p in pages])
            
            # Check quality
            clean_text = extracted_text.strip()
            if len(clean_text) < min_text_length:
                logger.warning(f"Standard extraction yielded only {len(clean_text)} chars. text='{clean_text[:50]}...'")
                logger.info("Detected scanned/handwritten PDF -> Triggering OCR fallback...")
                
                # Method 2: OCR Fallback
                ocr = get_ocr_processor()
                extracted_text = ocr.extract_text_from_pdf(str(pdf_path))
                used_ocr = True
            
        except Exception as e:
            logger.error(f"Text extraction failed for {pdf_path}: {e}")
            # If standard loader crashed, try OCR anyway? 
            # Potentially yes, but for now we'll just log error.
            return ""

        # Logging summary
        log_sample = extracted_text[:200].replace('\n', ' ')
        logger.info(f"Extraction successful (OCR={used_ocr}). Length: {len(extracted_text)}")
        logger.info(f"Sample: {log_sample}...")
        
        return extracted_text

text_extractor = TextExtractor()
