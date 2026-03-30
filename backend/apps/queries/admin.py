from django.contrib import admin

from .models import QueryLog


@admin.register(QueryLog)
class QueryLogAdmin(admin.ModelAdmin):
    list_display = ("user", "timestamp")
    search_fields = ("user__username", "question")
    ordering = ("-timestamp",)
