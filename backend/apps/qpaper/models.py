from django.db import models
from django.conf import settings
from apps.courses.models import Course
from shared.constants.enums import DifficultyLevel

class QuestionPaper(models.Model):
    title = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="question_papers")
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=20, choices=[(d.value, d.name) for d in DifficultyLevel])
    total_marks = models.PositiveIntegerField(default=100)
    duration_minutes = models.PositiveIntegerField(default=180)
    instructions = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    paper = models.ForeignKey(QuestionPaper, on_delete=models.CASCADE, related_name="questions")
    content = models.TextField()
    marks = models.PositiveIntegerField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Q{self.order} - {self.paper.title}"
