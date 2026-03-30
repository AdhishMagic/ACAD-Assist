import { apiClient } from '@/shared/lib/http/axios';

export const systemAPI = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },
  
  getFilePreview: async (id) => {
    const response = await apiClient.get(`/files/${id}`);
    return response.data;
  },

  deleteFile: async (id) => {
    const response = await apiClient.delete(`/files/${id}`);
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
