import axiosInstance from '../../../lib/axios';

export const studentAPI = {
  getDashboard: async () => {
    const response = await axiosInstance.get('/api/student/dashboard');
    return response.data;
  },
  
  getOverview: async () => {
    const response = await axiosInstance.get('/api/student/overview');
    return response.data;
  },
  
  getRecentNotes: async () => {
    const response = await axiosInstance.get('/api/student/recent-notes');
    return response.data;
  },

  getUpcomingTests: async () => {
    const response = await axiosInstance.get('/api/student/upcoming-tests');
    return response.data;
  }
};
