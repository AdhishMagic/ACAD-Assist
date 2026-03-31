import uuid

from django.db import models
from django.utils import timezone

from db_design.mixins import ActiveManager


class AuditModel(models.Model):
	id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	created_by = models.ForeignKey(
		'users.User',
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='+',
	)
	updated_by = models.ForeignKey(
		'users.User',
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name='+',
	)
	created_at = models.DateTimeField(auto_now_add=True, db_index=True)
	updated_at = models.DateTimeField(auto_now=True)
	deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)

	objects = ActiveManager()
	all_objects = models.Manager()

	class Meta:
		abstract = True

	def delete(self, using=None, keep_parents=False):
		self.deleted_at = timezone.now()
		self.save(update_fields=["deleted_at", "updated_at"])

	def hard_delete(self, using=None, keep_parents=False):
		return super().delete(using=using, keep_parents=keep_parents)
