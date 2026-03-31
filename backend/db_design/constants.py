from django.db import models


class UserRole(models.TextChoices):
	STUDENT = "student", "Student"
	TEACHER = "teacher", "Teacher"
	HOD = "hod", "HOD"
	ADMIN = "admin", "Admin"


class ApprovalStatus(models.TextChoices):
	PENDING = "pending", "Pending"
	APPROVED = "approved", "Approved"
	REJECTED = "rejected", "Rejected"


class NoteSource(models.TextChoices):
	MANUAL = "manual", "Manual"
	AI = "ai", "AI"


class QueryStatus(models.TextChoices):
	OPEN = "open", "Open"
	ANSWERED = "answered", "Answered"
	FAILED = "failed", "Failed"


class SubmissionStatus(models.TextChoices):
	DRAFT = "draft", "Draft"
	SUBMITTED = "submitted", "Submitted"
	EVALUATED = "evaluated", "Evaluated"


class NotificationStatus(models.TextChoices):
	UNREAD = "unread", "Unread"
	READ = "read", "Read"


class NotificationType(models.TextChoices):
	INFO = "info", "Info"
	SUCCESS = "success", "Success"
	WARNING = "warning", "Warning"
