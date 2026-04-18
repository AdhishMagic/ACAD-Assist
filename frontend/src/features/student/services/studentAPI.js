import { apiClient } from '@/shared/lib/http/axios';

export const studentAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/api/student/dashboard/');
    return response.data;
  },
  
  getOverview: async () => {
    const response = await apiClient.get('/api/student/overview/');
    return response.data;
  },
  
  getRecentNotes: async () => {
    const response = await apiClient.get('/student/recent-notes');
    return response.data;
  },

  getUpcomingTests: async () => {
    const response = await apiClient.get('/student/upcoming-tests');
    return response.data;
  }
};
