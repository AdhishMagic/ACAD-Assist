from django.urls import path

from apps.queries.views import AIFeedbackView, AIChatHistoryView, AIChatView, AIConversationDetailView


urlpatterns = [
	path("chat/", AIChatView.as_view(), name="ai-chat"),
	path("history/", AIChatHistoryView.as_view(), name="ai-history"),
	path("history/<str:conversation_id>/", AIConversationDetailView.as_view(), name="ai-conversation-detail"),
	path("feedback/", AIFeedbackView.as_view(), name="ai-feedback"),
]
