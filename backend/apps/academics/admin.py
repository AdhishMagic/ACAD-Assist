from django.contrib import admin

from apps.academics.models import Material, Subject, Unit


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
	list_display = ("code", "name", "created_at")
	search_fields = ("code", "name")


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
	list_display = ("title", "subject", "status", "created_at")
	list_filter = ("status", "subject")
	search_fields = ("title",)


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
	list_display = ("title", "subject", "order_index", "code", "created_at")
	list_filter = ("subject",)
	search_fields = ("title", "code", "subject__name", "subject__code")
