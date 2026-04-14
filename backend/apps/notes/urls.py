from django.urls import path

from .views import MyNotesListView, NoteDetailView, NotePublishView, NotesListCreateView, NotesSubjectListView, BookmarkNoteView, BookmarkedNotesListView


urlpatterns = [
	path("", NotesListCreateView.as_view(), name="note-list-create"),
	path("my/", MyNotesListView.as_view(), name="note-my-list"),
	path("bookmarked/", BookmarkedNotesListView.as_view(), name="note-bookmarked-list"),
	path("subjects/", NotesSubjectListView.as_view(), name="note-subject-list"),
	path("<uuid:pk>/", NoteDetailView.as_view(), name="note-detail"),
	path("<uuid:pk>/publish/", NotePublishView.as_view(), name="note-publish"),
	path("<uuid:pk>/bookmark/", BookmarkNoteView.as_view(), name="note-bookmark"),
]