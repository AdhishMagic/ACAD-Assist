import { apiClient } from '@/shared/lib/http/axios';

export const teacherAPI = {
  getDashboardData: () => apiClient.get('/api/admin/teacher/dashboard/'),
  getClasses: () => apiClient.get('/api/admin/teacher/classes/'),
  getStudentActivity: () => apiClient.get('/api/admin/teacher/activity/'),
  uploadNotes: (formData) => apiClient.post('/api/materials/', formData),
};
