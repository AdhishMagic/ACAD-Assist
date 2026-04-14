from __future__ import annotations

import hashlib
import mimetypes
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from rest_framework import serializers


MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".zip"}
EDITABLE_EXTENSIONS = {".docx", ".txt"}


def get_extension(upload_name: str) -> str:
	return Path(upload_name or "").suffix.lower()


def detect_file_type(upload_name: str) -> str:
	extension = get_extension(upload_name)
	if extension not in ALLOWED_EXTENSIONS:
		raise serializers.ValidationError("Only PDF, DOCX, TXT, PNG, JPG, JPEG, and ZIP files are allowed.")
	return extension.lstrip(".")


def build_upload_metadata(uploaded_file) -> dict:
	mime_type, _ = mimetypes.guess_type(uploaded_file.name)
	return {
		"mime_type": mime_type or getattr(uploaded_file, "content_type", "") or "",
		"size_bytes": int(getattr(uploaded_file, "size", 0) or 0),
		"original_name": uploaded_file.name,
	}


def compute_checksum(uploaded_file) -> str:
	hasher = hashlib.sha256()
	for chunk in uploaded_file.chunks():
		hasher.update(chunk)
	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)
	return hasher.hexdigest()


def extract_docx_text(uploaded_file) -> str:
	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	def collect_text_fragments(xml_content: bytes) -> list[str]:
		namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
		root = ET.fromstring(xml_content)
		paragraphs: list[str] = []
		for paragraph in root.findall(".//w:p", namespace):
			texts = [node.text for node in paragraph.findall(".//w:t", namespace) if node.text]
			line = "".join(texts).strip()
			if line:
				paragraphs.append(line)
		return paragraphs

	parts: list[str] = []
	with zipfile.ZipFile(uploaded_file) as archive:
		if "word/document.xml" in archive.namelist():
			parts.extend(collect_text_fragments(archive.read("word/document.xml")))

	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	return "\n".join(parts).strip()


def extract_txt_content(uploaded_file) -> str:
	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	raw_data = uploaded_file.read()
	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	for encoding in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
		try:
			return raw_data.decode(encoding).strip()
		except UnicodeDecodeError:
			continue

	raise serializers.ValidationError("The text file could not be decoded.")


def extract_editable_content(uploaded_file, file_type: str) -> str:
	if file_type == "docx":
		return extract_docx_text(uploaded_file)
	if file_type == "txt":
		return extract_txt_content(uploaded_file)
	return ""


def derive_title_from_content(content: str, fallback_name: str) -> str:
	for line in (content or "").splitlines():
		normalized = line.strip()
		if normalized:
			return normalized[:255]

	name = Path(fallback_name or "").stem.strip()
	return (name or "Untitled Note")[:255]