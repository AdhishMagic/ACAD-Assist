from django.contrib import admin

from apps.knowledge.models import Document, DocumentChunk


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
	list_display = ("title", "subject", "created_at")
	search_fields = ("title",)


@admin.register(DocumentChunk)
class DocumentChunkAdmin(admin.ModelAdmin):
	list_display = ("document", "chunk_index", "created_at")
	search_fields = ("document__title",)
