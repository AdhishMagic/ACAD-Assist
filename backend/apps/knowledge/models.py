from django.contrib.postgres.indexes import GinIndex
from django.db import models
from pgvector.django import VectorField

from apps.academics.models import Subject
from db_design.base import AuditModel


class Document(AuditModel):
	subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name="documents")
	title = models.CharField(max_length=255)
	content = models.TextField()
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["subject"], name="idx_document_subject"),
		]
		verbose_name = "Document"
		verbose_name_plural = "Documents"

	def __str__(self):
		return self.title


class DocumentChunk(AuditModel):
	document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="chunks")
	chunk_index = models.PositiveIntegerField()
	content = models.TextField()
	embedding = VectorField(dimensions=1536, null=True, blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		unique_together = ("document", "chunk_index")
		indexes = [
			models.Index(fields=["document", "chunk_index"], name="idx_chunk_doc_pos"),
		]
		verbose_name = "Document Chunk"
		verbose_name_plural = "Document Chunks"

	def __str__(self):
		return f"{self.document_id}:{self.chunk_index}"
