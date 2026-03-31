from django.contrib import admin

from apps.analytics.models import AIUsageLog, ActivityLog


admin.site.register(ActivityLog)
admin.site.register(AIUsageLog)
