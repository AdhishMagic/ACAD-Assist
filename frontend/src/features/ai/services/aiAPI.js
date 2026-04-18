import { apiClient } from '@/shared/lib/http/axios';
import { notesAPI } from '@/features/notes/services/notesAPI';

export const aiAPI = {
  chat: async ({ content, conversationId = null, files = [], messages = null, file = null }) => {
    const mergedFiles = files?.length ? files : (file ? [file] : []);
    const formData = new FormData();
    formData.append('content', content || '');
    if (conversationId) {
      formData.append('conversation_id', String(conversationId));
    }
    if (messages) {
      formData.append('messages', JSON.stringify(messages));
    }

    mergedFiles.forEach((item) => {
      if (item instanceof File) {
        formData.append('files', item);
      } else if (typeof item === 'string') {
        formData.append('files', item);
      }
    });

    const response = await apiClient.post('/api/ai/chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await apiClient.get('/api/ai/history/');
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await apiClient.get(`/api/ai/history/${conversationId}/`);
    return response.data;
  },

  createConversation: async (title = 'New Conversation') => {
    const response = await apiClient.post('/api/ai/history/', { title });
    return response.data;
  },

  renameConversation: async (conversationId, title) => {
    const response = await apiClient.patch(`/api/ai/history/${conversationId}/`, { title });
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    await apiClient.delete(`/api/ai/history/${conversationId}/`);
    return true;
  },

  sendFeedback: async ({ queryId, reaction = 'like', comment = '', metadata = {} }) => {
    const response = await apiClient.post('/api/ai/feedback/', {
      query_id: queryId,
      reaction,
      comment,
      metadata,
    });
    return response.data;
  },
  
  getSavedNotes: async () => {
    const response = await notesAPI.getBookmarkedNotes();
    return response?.notes || [];
  },
  
  getGeneratedNote: async (id) => {
    // Redirect to backend note endpoint instead of AI service
    return notesAPI.getNoteById(id);
  },

  // Redirect to backend note creation instead of AI service
  saveNote: async (data) => {
    const createdNote = await notesAPI.createNote({
      title: data.title,
      content: data.content,
      subject: data.topic || '',
      tags: [],
    });
    // Automatically bookmark the newly created note
    return await notesAPI.toggleBookmark(createdNote.id);
  },

  deleteNote: async (id) => {
    throw new Error('Deleting saved notes from AI chat is not supported. Use notes endpoints instead.');
  }
};
