from django.urls import path

from .views import (
	ExamListView,
	ExamDetailView,
	ExamSubjectCatalogView,
	ExamSubjectUnitsView,
	ExamTemplateListCreateView,
	GenerateExamView,
	PublishExamView,
)


urlpatterns = [
	path("catalog/subjects/", ExamSubjectCatalogView.as_view(), name="exam-subject-catalog"),
	path("catalog/subjects/<uuid:subject_id>/units/", ExamSubjectUnitsView.as_view(), name="exam-subject-units"),
	path("templates/", ExamTemplateListCreateView.as_view(), name="exam-template-list-create"),
	path("", ExamListView.as_view(), name="exam-list"),
	path("generate/", GenerateExamView.as_view(), name="exam-generate"),
	path("<int:id>/", ExamDetailView.as_view(), name="exam-detail"),
	path("<int:id>/publish/", PublishExamView.as_view(), name="exam-publish"),
]
