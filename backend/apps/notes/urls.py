from django.urls import path

from .views import SavedNotesView, SaveNoteView


urlpatterns = [
	path("save/", SaveNoteView.as_view(), name="note-save"),
	path("saved/", SavedNotesView.as_view(), name="note-saved-list"),
]