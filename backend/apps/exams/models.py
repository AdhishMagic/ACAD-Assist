from django.conf import settings
from django.db import models

from apps.academics.models import Subject
from db_design.base import AuditModel
from db_design.constants import SubmissionStatus


class ExamTemplate(models.Model):
	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Exam Template"
		verbose_name_plural = "Exam Templates"

	title = models.CharField(max_length=255)
	pattern_json = models.JSONField(default=dict, blank=True)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="exam_templates",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title


class ExamPaper(models.Model):
	class Status(models.TextChoices):
		DRAFT = "draft", "Draft"
		PUBLISHED = "published", "Published"

	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Exam Paper"
		verbose_name_plural = "Exam Papers"

	title = models.CharField(max_length=255, default="Question Paper Draft")
	subject = models.CharField(max_length=255)
	subject_ref = models.ForeignKey(
		Subject,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="generated_exam_papers",
	)
	lesson_range = models.JSONField(default=dict, blank=True)
	difficulty = models.CharField(max_length=50)
	template = models.ForeignKey(ExamTemplate, on_delete=models.CASCADE, related_name="exam_papers")
	exam_json = models.JSONField(default=dict, blank=True)
	status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="exam_papers",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title


class Exam(AuditModel):
	subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="exams")
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	scheduled_at = models.DateTimeField(null=True, blank=True)
	duration_minutes = models.PositiveIntegerField(default=60)

	class Meta:
		ordering = ['-created_at']
		verbose_name = "Exam"
		verbose_name_plural = "Exams"

	def __str__(self):
		return self.title


class Question(AuditModel):
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
	prompt = models.TextField()
	marks = models.DecimalField(max_digits=6, decimal_places=2, default=1)
	metadata = models.JSONField(default=dict, blank=True)

	class Meta:
		ordering = ['-created_at']
		verbose_name = "Question"
		verbose_name_plural = "Questions"

	def __str__(self):
		return f"Question {self.id}"


class Option(AuditModel):
	question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
	text = models.CharField(max_length=500)
	is_correct = models.BooleanField(default=False, db_index=True)

	class Meta:
		ordering = ['-created_at']
		verbose_name = "Option"
		verbose_name_plural = "Options"

	def __str__(self):
		return self.text


class Submission(AuditModel):
	exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="submissions")
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
	status = models.CharField(max_length=20, choices=SubmissionStatus.choices, default=SubmissionStatus.DRAFT, db_index=True)
	score = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

	class Meta:
		ordering = ['-created_at']
		constraints = [
			models.UniqueConstraint(fields=["exam", "user"], name="uniq_submission_exam_user"),
		]
		indexes = [
			models.Index(fields=["exam", "user"], name="idx_submission_exam_user"),
		]
		verbose_name = "Submission"
		verbose_name_plural = "Submissions"

	def __str__(self):
		return f"Submission {self.id}"


class Answer(AuditModel):
	submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="answers")
	question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
	selected_option = models.ForeignKey(Option, on_delete=models.SET_NULL, null=True, blank=True)
	text_answer = models.TextField(blank=True)
	awarded_marks = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

	class Meta:
		ordering = ['-created_at']
		constraints = [
			models.UniqueConstraint(fields=["submission", "question"], name="uniq_answer_submission_question"),
		]
		verbose_name = "Answer"
		verbose_name_plural = "Answers"

	def __str__(self):
		return f"Answer {self.id}"
