from django.contrib import admin

from apps.files.models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
	list_display = ("original_name", "file_type", "uploaded_by", "is_editable", "created_at")
	list_filter = ("file_type", "is_editable")
	search_fields = ("original_name", "checksum", "storage_path")
