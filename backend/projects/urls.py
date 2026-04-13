from django.urls import path

from .views import AllProjectsView, ApproveProjectView, MyProjectsView, ProjectSubmitView, RejectProjectView


urlpatterns = [
    path("submit/", ProjectSubmitView.as_view(), name="project-submit"),
    path("my/", MyProjectsView.as_view(), name="project-my"),
    path("all/", AllProjectsView.as_view(), name="project-all"),
    path("<int:pk>/approve/", ApproveProjectView.as_view(), name="project-approve"),
    path("<int:pk>/reject/", RejectProjectView.as_view(), name="project-reject"),
]
