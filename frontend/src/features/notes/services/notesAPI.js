import axios from 'axios';

// Base API setup, assuming generic /api prefix
const apiClient = axios.create({
  baseURL: '/api'
});

export const notesAPI = {
  getAllNotes: async (params) => {
    const response = await apiClient.get('/notes', { params });
    return response.data;
  },
  
  getNotesBySubject: async (subjectId, params) => {
    const response = await apiClient.get(`/notes/subject/${subjectId}`, { params });
    return response.data;
  },
  
  getNoteById: async (noteId) => {
    const response = await apiClient.get(`/notes/${noteId}`);
    return response.data;
  },
  
  toggleBookmark: async (noteId) => {
    const response = await apiClient.post(`/notes/${noteId}/bookmark`);
    return response.data;
  }
};
