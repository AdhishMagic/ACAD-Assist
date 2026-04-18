from django.conf import settings
from django.db import models

from db_design.base import AuditModel
from db_design.constants import QueryStatus


class Query(AuditModel):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="queries")
	prompt = models.TextField()
	context = models.JSONField(default=dict, blank=True)
	status = models.CharField(max_length=20, choices=QueryStatus.choices, default=QueryStatus.OPEN, db_index=True)

	class Meta:
		ordering = ['-created_at']
		indexes = [
			models.Index(fields=["user"], name="idx_query_user"),
		]
		verbose_name = "Query"
		verbose_name_plural = "Queries"

	def __str__(self):
		return f"Query {self.id}"


class Response(AuditModel):
	query = models.OneToOneField(Query, on_delete=models.CASCADE, related_name="response")
	responder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
	response_text = models.TextField()
	latency_ms = models.PositiveIntegerField(default=0)
	model_name = models.CharField(max_length=100)
	token_usage = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		verbose_name = "Response"
		verbose_name_plural = "Responses"

	def __str__(self):
		return f"Response for {self.query_id}"


class Feedback(AuditModel):
	class Reaction(models.TextChoices):
		LIKE = "like", "Like"
		DISLIKE = "dislike", "Dislike"

	query = models.ForeignKey(Query, on_delete=models.CASCADE, related_name="feedback_entries")
	response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name="feedback_entries", null=True, blank=True)
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="query_feedback")
	reaction = models.CharField(max_length=20, choices=Reaction.choices, db_index=True)
	comment = models.TextField(blank=True)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Feedback"
		verbose_name_plural = "Feedback"
		indexes = [
			models.Index(fields=["query"], name="idx_feedback_query"),
			models.Index(fields=["user"], name="idx_feedback_user"),
		]

	def __str__(self):
		return f"Feedback {self.reaction} for {self.query_id}"
