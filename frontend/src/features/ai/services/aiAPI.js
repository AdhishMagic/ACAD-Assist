import { aiClient } from '@/shared/lib/http/axios';
import { notesAPI } from '@/features/notes/services/notesAPI';

export const aiAPI = {
  chat: async (messages, file = null) => {
    const response = await aiClient.post('/chat', { messages, file });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await aiClient.get('/history');
    return response.data;
  },
  
  getSavedNotes: async () => {
    const response = await aiClient.get('/saved-notes');
    return response.data;
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
    const response = await aiClient.delete(`/saved-notes/${id}`);
    return response.data;
  }
};
