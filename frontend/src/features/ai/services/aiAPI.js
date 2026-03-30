import { aiClient } from '@/shared/lib/http/axios';
import { shouldFallbackToMock } from '@/shared/lib/http/apiMode';
import { mockGeneratedAiNote, mockSavedAiNotes } from '@/shared/mocks/ai.mock';

export const aiAPI = {
  chat: async (messages, file = null) => {
    try {
      const response = await aiClient.post('/chat', { messages, file });
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Here is an explanation of the topic. **Key point 1**: Understand the basics. *Note*: This is a simulated response.',
        timestamp: new Date().toISOString(),
      };
    }
  },
  
  getHistory: async () => {
    try {
      const response = await aiClient.get('/history');
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return [];
    }
  },
  
  getSavedNotes: async () => {
    try {
      const response = await aiClient.get('/saved-notes');
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return mockSavedAiNotes;
    }
  },
  
  getGeneratedNote: async (id) => {
    try {
      const response = await aiClient.get(`/generated/${id}`);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return { ...mockGeneratedAiNote, id: String(id) };
    }
  },

  saveNote: async (data) => {
    try {
      const response = await aiClient.post('/saved-notes', data);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return { success: true };
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await aiClient.delete(`/saved-notes/${id}`);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      return { success: true };
    }
  }
};
