from __future__ import annotations

import hashlib
import mimetypes
import re
import zlib
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from rest_framework import serializers


MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".png", ".jpg", ".jpeg", ".zip"}
EDITABLE_EXTENSIONS = {".pdf", ".docx", ".txt"}


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


def extract_pdf_text(uploaded_file) -> str:
	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	raw_data = uploaded_file.read()

	if hasattr(uploaded_file, "seek"):
		uploaded_file.seek(0)

	if not raw_data:
		return ""

	text_fragments: list[str] = []

	def _decode_pdf_text(value: bytes) -> str:
		try:
			text = value.decode("utf-8")
		except UnicodeDecodeError:
			text = value.decode("latin-1", errors="ignore")
		text = text.replace("\\(", "(").replace("\\)", ")").replace("\\n", "\n").replace("\\r", "")
		return text.strip()

	def _extract_from_stream(stream_bytes: bytes) -> None:
		for match in re.finditer(rb"\((.*?)\)\s*Tj", stream_bytes, flags=re.DOTALL):
			text = _decode_pdf_text(match.group(1))
			if text:
				text_fragments.append(text)

		for match in re.finditer(rb"\[(.*?)\]\s*TJ", stream_bytes, flags=re.DOTALL):
			chunks = re.findall(rb"\((.*?)\)", match.group(1), flags=re.DOTALL)
			joined = " ".join(filter(None, (_decode_pdf_text(chunk) for chunk in chunks))).strip()
			if joined:
				text_fragments.append(joined)

	for stream_match in re.finditer(rb"stream\r?\n(.*?)\r?\nendstream", raw_data, flags=re.DOTALL):
		stream_bytes = stream_match.group(1)
		candidates = [stream_bytes]
		try:
			candidates.append(zlib.decompress(stream_bytes))
		except Exception:
			pass

		for candidate in candidates:
			_extract_from_stream(candidate)

	return "\n".join(dict.fromkeys(fragment for fragment in text_fragments if fragment)).strip()


def extract_editable_content(uploaded_file, file_type: str) -> str:
	if file_type == "pdf":
		return extract_pdf_text(uploaded_file)
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


def build_exam_template_suggestion(content: str, fallback_name: str) -> dict:
	title = derive_title_from_content(content, fallback_name)
	text = str(content or "").strip()
	lines = [line.strip() for line in text.splitlines() if line.strip()]
	lower_text = text.lower()

	sections = []
	section_hints = [
		("MCQ", ["mcq", "multiple choice", "choose the correct"]),
		("Short Answer", ["short answer", "brief answer", "write short notes"]),
		("Long Answer", ["long answer", "essay", "explain in detail", "descriptive"]),
		("Definition", ["define", "definition"]),
	]

	for index, (question_type, keywords) in enumerate(section_hints, start=1):
		if any(keyword in lower_text for keyword in keywords):
			marks = 1 if question_type == "MCQ" else 2 if question_type in {"Definition", "Short Answer"} else 10
			count = 5 if question_type == "MCQ" else 3 if question_type in {"Definition", "Short Answer"} else 2
			sections.append(
				{
					"id": str(index),
					"name": f"Section {chr(64 + index)}: {question_type}",
					"questionType": question_type,
					"questionCount": count,
					"marksPerQuestion": marks,
					"difficulty": "Medium",
				}
			)

	if not sections:
		reference_length = len(lines)
		if reference_length >= 25:
			sections = [
				{
					"id": "1",
					"name": "Section A: Short Answer",
					"questionType": "Short Answer",
					"questionCount": 5,
					"marksPerQuestion": 2,
					"difficulty": "Medium",
				},
				{
					"id": "2",
					"name": "Section B: Long Answer",
					"questionType": "Long Answer",
					"questionCount": 2,
					"marksPerQuestion": 10,
					"difficulty": "Medium",
				},
			]
		else:
			sections = [
				{
					"id": "1",
					"name": "Section A: Short Answer",
					"questionType": "Short Answer",
					"questionCount": 5,
					"marksPerQuestion": 2,
					"difficulty": "Medium",
				}
			]

	return {
		"examTitle": title,
		"title": title,
		"duration": 60,
		"sourceName": Path(fallback_name or "").name,
		"sections": sections,
	}
