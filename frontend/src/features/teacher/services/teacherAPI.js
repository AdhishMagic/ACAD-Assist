import {
  mockTeacherActivityData,
  mockTeacherClassesData,
  mockTeacherDashboardData,
} from '@/shared/mocks/teacher.mock';

export const teacherAPI = {
  getDashboardData: async () => {
    try {
      // return await axios.get('/api/teacher/dashboard');
      return { data: mockTeacherDashboardData };
    } catch (error) {
      console.error('Error fetching dashboard data, falling back to mock:', error);
      return { data: mockTeacherDashboardData };
    }
  },

  getClasses: async () => {
    try {
      // return await axios.get('/api/teacher/classes');
      return { data: mockTeacherClassesData };
    } catch (error) {
      console.error('Error fetching classes, falling back to mock:', error);
      return { data: mockTeacherClassesData };
    }
  },

  getStudentActivity: async () => {
    try {
      // return await axios.get('/api/teacher/activity');
      return { data: mockTeacherActivityData };
    } catch (error) {
      console.error('Error fetching activity, falling back to mock:', error);
      return { data: mockTeacherActivityData };
    }
  },

  uploadNotes: async (formData) => {
    try {
      // return await axios.post('/api/teacher/upload-notes', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });
      console.log('Mock upload successful', [...formData.entries()]);
      return { data: { success: true, message: 'Notes uploaded successfully' } };
    } catch (error) {
      console.error('Error uploading notes:', error);
      throw error;
    }
  }
};
