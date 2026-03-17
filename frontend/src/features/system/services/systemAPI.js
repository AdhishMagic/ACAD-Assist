import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const systemAPI = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
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
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  deleteFile: async (id) => {
    const response = await api.delete(`/files/${id}`);
    return response.data;
  },

  getActivityFeed: async (params) => {
    const response = await api.get('/activity-feed', { params });
    return response.data;
  },

  globalSearch: async (query) => {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  }
};
