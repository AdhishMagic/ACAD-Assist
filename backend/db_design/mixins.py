from django.db import models
from django.utils import timezone


class ActiveQuerySet(models.QuerySet):
	def active(self):
		return self.filter(deleted_at__isnull=True)

	def inactive(self):
		return self.filter(deleted_at__isnull=False)

	def soft_delete(self):
		return self.update(deleted_at=timezone.now())

	def with_relations(self, select_related_fields=None, prefetch_related_fields=None):
		queryset = self
		if select_related_fields:
			queryset = queryset.select_related(*select_related_fields)
		if prefetch_related_fields:
			queryset = queryset.prefetch_related(*prefetch_related_fields)
		return queryset


class ActiveManager(models.Manager):
	def get_queryset(self):
		return ActiveQuerySet(self.model, using=self._db).active()
