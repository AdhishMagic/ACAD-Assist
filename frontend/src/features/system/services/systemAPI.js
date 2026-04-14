import { apiClient } from '@/shared/lib/http/axios';
import { uploadFile as uploadFileRequest } from '@/services/api/upload.api';

export const systemAPI = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return uploadFileRequest(formData, (progressEvent) => {
      if (!onProgress || !progressEvent?.total) {
        return;
      }

      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgress(percentCompleted);
    });
  },
  
  getFilePreview: async (id) => {
    const response = await apiClient.get(`/api/files/${id}/`);
    return response.data;
  },

  saveNote: async (payload) => {
    const response = await apiClient.post('/api/notes/save/', payload);
    return response.data;
  },

  getSavedNotes: async (params = {}) => {
    const response = await apiClient.get('/api/notes/saved/', { params });
    return response.data;
  },

  deleteFile: async (id) => {
    const response = await apiClient.delete(`/api/files/${id}/`);
    return response.data;
  },

  getActivityFeed: async (params) => {
    const response = await apiClient.get('/activity-feed', { params });
    return response.data;
  },

  globalSearch: async (query) => {
    const response = await apiClient.get('/search', { params: { q: query } });
    return response.data;
  }
};
