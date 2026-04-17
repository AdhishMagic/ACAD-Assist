import { apiClient } from '@/shared/lib/http/axios';

const notImplemented = () => {
  throw new Error('Admin API endpoints not implemented. Please configure backend endpoints.');
};

export const adminAPI = {
  getDashboardStats: () => apiClient.get('/api/admin/dashboard/'),
  getSystemAnalytics: () => apiClient.get('/api/admin/analytics/'),
  getUsers: () => apiClient.get('/api/admin/users/'),
  getUserActivity: (userId, limit = 500) => apiClient.get(`/api/admin/users/${userId}/activity/?limit=${limit}`),
  createUser: (payload) => apiClient.post('/api/admin/users/', payload),
  updateUserRole: (userId, newRole) => apiClient.patch(`/api/admin/users/${userId}/role/`, { role: newRole }),
  toggleUserStatus: (userId, status) => apiClient.patch(`/api/admin/users/${userId}/status/`, { status }),
  resetUserPassword: (userId, newPassword) => apiClient.post(`/api/admin/users/${userId}/reset-password/`, {
    new_password: newPassword,
  }),
  deleteUser: (userId) => apiClient.delete(`/api/admin/users/${userId}/`),
  getActivityLogs: notImplemented,
  getStorageStats: notImplemented,
  getFiles: notImplemented,
  deleteFile: notImplemented,
  getAiUsageStats: notImplemented,
};
