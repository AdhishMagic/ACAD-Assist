from django.contrib import admin

from .models import Material, Subject


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("title", "subject", "uploaded_by", "uploaded_at")
    list_filter = ("subject", "uploaded_at")
    search_fields = ("title",)
