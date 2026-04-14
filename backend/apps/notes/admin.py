from django.contrib import admin

from apps.notes.models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
	list_display = ("title", "created_by", "is_published", "file", "created_at")
	list_filter = ("is_published",)
	search_fields = ("title", "content")
