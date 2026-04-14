from django.contrib.auth.models import AbstractUser
from django.db import models

from db_design.base import AuditModel
from db_design.constants import UserRole


class User(AuditModel, AbstractUser):
	email = models.EmailField(unique=True, db_index=True)
	role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.STUDENT, db_index=True)
	bookmarked_notes = models.ManyToManyField('notes.Note', related_name='bookmarked_by', blank=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["role"], name="idx_user_role"),
		]
		verbose_name = "User"
		verbose_name_plural = "Users"

	def __str__(self):
		return f"{self.username} ({self.role})"
