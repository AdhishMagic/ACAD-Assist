from django.urls import path

from .views import (
    StudyMaterialBookmarkToggleView,
    StudyMaterialBookmarksView,
    StudyMaterialDetailView,
    StudyMaterialLibraryView,
    StudyMaterialListCreateView,
    StudyMaterialPublicListView,
    StudyMaterialPublishView,
)


urlpatterns = [
    path("", StudyMaterialListCreateView.as_view(), name="materials-list-create"),
    path("public/", StudyMaterialPublicListView.as_view(), name="materials-public"),
    path("library/", StudyMaterialLibraryView.as_view(), name="materials-library"),
    path("bookmarks/", StudyMaterialBookmarksView.as_view(), name="materials-bookmarks"),
    path("<uuid:pk>/publish/", StudyMaterialPublishView.as_view(), name="materials-publish"),
    path("<uuid:pk>/bookmark/", StudyMaterialBookmarkToggleView.as_view(), name="materials-bookmark-toggle"),
    path("<uuid:pk>/", StudyMaterialDetailView.as_view(), name="materials-detail"),
]
