from django.contrib import admin

from .models import StudyMaterial, StudyMaterialBookmark


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
	list_display = ("title", "file_type", "status", "is_public", "uploaded_by", "created_at")
	list_filter = ("file_type", "status", "is_public")
	search_fields = ("title", "content", "uploaded_by__email")
	readonly_fields = ("created_at", "updated_at")
	date_hierarchy = "created_at"


@admin.register(StudyMaterialBookmark)
class StudyMaterialBookmarkAdmin(admin.ModelAdmin):
	list_display = ("user", "material", "created_at")
	search_fields = ("user__email", "material__title")
	readonly_fields = ("created_at",)