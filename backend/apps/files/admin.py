from django.contrib import admin

from apps.files.models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
	list_display = ("filename", "owner", "checksum", "created_at")
	search_fields = ("filename", "checksum")
