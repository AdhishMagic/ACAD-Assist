from django.contrib import admin

from apps.exams.models import Answer, Exam, Option, Question, Submission


admin.site.register(Exam)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Submission)
admin.site.register(Answer)
