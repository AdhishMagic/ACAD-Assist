from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.users.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
	model = User
	list_display = ("username", "email", "role", "is_active", "is_staff", "created_at")
	list_filter = ("role", "is_active", "is_staff", "is_superuser")
	search_fields = ("username", "email", "first_name", "last_name")
