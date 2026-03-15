import axios from 'axios';

// Mock data to prevent proxy errors if backend is not ready
const mockDashboardData = {
  totalClasses: 8,
  uploadedNotes: 45,
  activeStudents: 156,
  aiGeneratedMaterials: 12,
  recentNotes: [
    { id: 1, title: 'Introduction to React', subject: 'Computer Science', date: '2026-03-14' },
    { id: 2, title: 'Advanced Calculus', subject: 'Mathematics', date: '2026-03-12' }
  ],
  recentInteractions: [
    { studentName: 'John Doe', action: 'Viewed Note', item: 'Introduction to React', time: '2 mins ago' },
    { studentName: 'Jane Smith', action: 'Asked AI', item: 'Calculus question', time: '15 mins ago' }
  ],
  latestAI: [
    { id: 1, title: 'React Quiz', type: 'Questions', date: '2026-03-15' },
    { id: 2, title: 'Calculus Summary', type: 'Summary', date: '2026-03-14' }
  ]
};

const mockClassesData = [
  { id: 1, name: 'CS101', subject: 'Computer Science', students: 45, materials: 12, lastActivity: '2026-03-15' },
  { id: 2, name: 'MATH201', subject: 'Mathematics', students: 38, materials: 8, lastActivity: '2026-03-14' },
  { id: 3, name: 'PHYS101', subject: 'Physics', students: 42, materials: 15, lastActivity: '2026-03-10' },
  { id: 4, name: 'ENG101', subject: 'English', students: 31, materials: 10, lastActivity: '2026-03-11' }
];

const mockActivityData = [
  { id: 1, name: 'John Doe', class: 'CS101', lastLogin: '2026-03-15', notesViewed: 12, aiQuestions: 5, studyHours: 15.5 },
  { id: 2, name: 'Jane Smith', class: 'MATH201', lastLogin: '2026-03-14', notesViewed: 8, aiQuestions: 12, studyHours: 22.0 },
  { id: 3, name: 'Alice Johnson', class: 'PHYS101', lastLogin: '2026-03-15', notesViewed: 15, aiQuestions: 2, studyHours: 18.5 },
  { id: 4, name: 'Bob Brown', class: 'ENG101', lastLogin: '2026-03-13', notesViewed: 6, aiQuestions: 0, studyHours: 9.0 }
];

export const teacherAPI = {
  getDashboardData: async () => {
    try {
      // return await axios.get('/api/teacher/dashboard');
      return { data: mockDashboardData };
    } catch (error) {
      console.error('Error fetching dashboard data, falling back to mock:', error);
      return { data: mockDashboardData };
    }
  },

  getClasses: async () => {
    try {
      // return await axios.get('/api/teacher/classes');
      return { data: mockClassesData };
    } catch (error) {
      console.error('Error fetching classes, falling back to mock:', error);
      return { data: mockClassesData };
    }
  },

  getStudentActivity: async () => {
    try {
      // return await axios.get('/api/teacher/activity');
      return { data: mockActivityData };
    } catch (error) {
      console.error('Error fetching activity, falling back to mock:', error);
      return { data: mockActivityData };
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
