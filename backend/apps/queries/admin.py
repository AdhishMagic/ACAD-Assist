from django.contrib import admin

from apps.queries.models import Feedback, Query, Response


@admin.register(Query)
class QueryAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "status", "created_at")
	list_filter = ("status",)
	search_fields = ("prompt",)


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
	list_display = ("query", "model_name", "latency_ms", "created_at")
	search_fields = ("model_name", "response_text")


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
	list_display = ("query", "user", "reaction", "created_at")
	list_filter = ("reaction",)
	search_fields = ("comment",)
