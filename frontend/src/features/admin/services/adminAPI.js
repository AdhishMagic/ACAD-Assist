import { apiClient } from '@/shared/lib/http/axios';

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
  getActivityLogs: (limit = 500) => apiClient.get(`/api/admin/activity-logs/?limit=${limit}`),
  getStorageStats: () => apiClient.get('/api/admin/storage/stats/'),
  getFiles: (limit = 500) => apiClient.get(`/api/admin/storage/files/?limit=${limit}`),
  deleteFile: (fileId) => apiClient.delete(`/api/admin/storage/files/${encodeURIComponent(fileId)}/`),
  getAiUsageStats: () => apiClient.get('/api/admin/ai-usage/'),
};
