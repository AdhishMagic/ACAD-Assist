from django.db import models
from django.conf import settings
from apps.courses.models import Course

class StudentProgress(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress")
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    completion_percentage = models.FloatField(default=0.0)
    last_accessed = models.DateTimeField(auto_now=True)
    time_spent_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.completion_percentage}%)"
