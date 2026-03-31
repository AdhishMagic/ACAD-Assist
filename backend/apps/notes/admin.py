from django.contrib import admin

from apps.notes.models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
	list_display = ("title", "user", "source", "created_at")
	list_filter = ("source",)
	search_fields = ("title", "body")
