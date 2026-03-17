// hodAPI.js
// Mock implementations are provided to prevent proxy errors, aligning with previous features.

const MOCK_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hodAPI = {
  // ─── Dashboard ───────────────────────────────────────────────
  getDashboard: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        stats: {
          totalTeachers: 24,
          activeCourses: 156,
          uploadedMaterials: 890,
          studentEngagementRate: 85,
        },
        trends: {
          totalTeachers: { change: 8, direction: 'up' },
          activeCourses: { change: 12, direction: 'up' },
          uploadedMaterials: { change: 5, direction: 'up' },
          studentEngagementRate: { change: -2, direction: 'down' },
        },
        recentTeacherActivity: [
          { id: 1, teacher: 'Dr. Sarah Smith', action: 'Uploaded lecture notes for Advanced AI', time: '2 hours ago', type: 'upload' },
          { id: 2, teacher: 'Prof. John Doe', action: 'Created 5 AI-generated quiz questions', time: '4 hours ago', type: 'ai-generate' },
          { id: 3, teacher: 'Dr. Emily Chen', action: 'Updated syllabus for Data Structures', time: '6 hours ago', type: 'update' },
          { id: 4, teacher: 'Prof. Mike Johnson', action: 'Scheduled live session for Cloud Computing', time: '8 hours ago', type: 'schedule' },
          { id: 5, teacher: 'Dr. Lisa Wang', action: 'Graded 45 assignments for Machine Learning', time: '1 day ago', type: 'grade' },
        ],
        recentCourseSubmissions: [
          { id: 1, title: 'Advanced Neural Networks — Module 5', teacher: 'Dr. Sarah Smith', date: '2026-03-16', status: 'Pending' },
          { id: 2, title: 'React Performance Patterns', teacher: 'Prof. John Doe', date: '2026-03-15', status: 'Pending' },
          { id: 3, title: 'Python Data Pipelines Lab', teacher: 'Dr. Emily Chen', date: '2026-03-14', status: 'Approved' },
          { id: 4, title: 'Kubernetes Hands-On Guide', teacher: 'Prof. Mike Johnson', date: '2026-03-13', status: 'Rejected' },
        ],
        departmentAlerts: [
          { id: 1, message: '3 course materials pending approval for over 48 hours', severity: 'warning', time: '1 hour ago' },
          { id: 2, message: 'Student engagement dropped 5% in Cloud Computing', severity: 'error', time: '3 hours ago' },
          { id: 3, message: 'Dr. Lisa Wang completed all grading for ML course', severity: 'success', time: '6 hours ago' },
          { id: 4, message: 'New semester course registration opens next week', severity: 'info', time: '1 day ago' },
        ],
      }
    };
  },

  // ─── Performance ─────────────────────────────────────────────
  getPerformance: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        courseActivity: [
          { name: 'Week 1', activeCourses: 120, completions: 45, enrollments: 80 },
          { name: 'Week 2', activeCourses: 130, completions: 60, enrollments: 95 },
          { name: 'Week 3', activeCourses: 145, completions: 80, enrollments: 110 },
          { name: 'Week 4', activeCourses: 156, completions: 110, enrollments: 130 },
          { name: 'Week 5', activeCourses: 160, completions: 125, enrollments: 145 },
          { name: 'Week 6', activeCourses: 168, completions: 140, enrollments: 155 },
        ],
        materialsPerCourse: [
          { name: 'Advanced AI', notes: 45, videos: 12, assignments: 8 },
          { name: 'Data Structures', notes: 38, videos: 10, assignments: 15 },
          { name: 'Cloud Computing', notes: 30, videos: 18, assignments: 6 },
          { name: 'Machine Learning', notes: 52, videos: 20, assignments: 12 },
          { name: 'Web Dev', notes: 28, videos: 8, assignments: 10 },
        ],
        aiContentUsage: [
          { name: 'Jan', generated: 120, reviewed: 95, published: 80 },
          { name: 'Feb', generated: 180, reviewed: 150, published: 130 },
          { name: 'Mar', generated: 250, reviewed: 210, published: 185 },
          { name: 'Apr', generated: 310, reviewed: 280, published: 250 },
          { name: 'May', generated: 380, reviewed: 340, published: 310 },
          { name: 'Jun', generated: 420, reviewed: 390, published: 360 },
        ],
      }
    };
  },

  // ─── Teacher Contributions ──────────────────────────────────
  getTeacherContributions: async (filters = {}) => {
    await delay(MOCK_DELAY);
    let teachers = [
      { id: 1, name: 'Dr. Sarah Smith', coursesHandled: 4, notesUploaded: 45, aiMaterialsGenerated: 120, lastActivity: '2026-03-16', course: 'Advanced AI' },
      { id: 2, name: 'Prof. John Doe', coursesHandled: 3, notesUploaded: 30, aiMaterialsGenerated: 85, lastActivity: '2026-03-15', course: 'Web Dev' },
      { id: 3, name: 'Dr. Emily Chen', coursesHandled: 5, notesUploaded: 60, aiMaterialsGenerated: 150, lastActivity: '2026-03-14', course: 'Data Structures' },
      { id: 4, name: 'Prof. Mike Johnson', coursesHandled: 2, notesUploaded: 22, aiMaterialsGenerated: 65, lastActivity: '2026-03-13', course: 'Cloud Computing' },
      { id: 5, name: 'Dr. Lisa Wang', coursesHandled: 4, notesUploaded: 55, aiMaterialsGenerated: 140, lastActivity: '2026-03-12', course: 'Machine Learning' },
      { id: 6, name: 'Prof. Alex Turner', coursesHandled: 3, notesUploaded: 35, aiMaterialsGenerated: 90, lastActivity: '2026-03-11', course: 'Advanced AI' },
      { id: 7, name: 'Dr. Rachel Kim', coursesHandled: 2, notesUploaded: 18, aiMaterialsGenerated: 50, lastActivity: '2026-03-10', course: 'Web Dev' },
    ];

    if (filters.course && filters.course !== 'all') {
      teachers = teachers.filter(t => t.course === filters.course);
    }
    return {
      data: {
        teachers,
        courses: ['Advanced AI', 'Data Structures', 'Cloud Computing', 'Machine Learning', 'Web Dev'],
      }
    };
  },

  // ─── Material Approvals ─────────────────────────────────────
  getMaterialApprovals: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        approvals: [
          { id: 1, title: 'Neural Network Lab Manual', teacher: 'Dr. Sarah Smith', course: 'Advanced AI', date: '2026-03-16', status: 'Pending' },
          { id: 2, title: 'React Hooks Deep Dive Notes', teacher: 'Prof. John Doe', course: 'Web Dev', date: '2026-03-15', status: 'Pending' },
          { id: 3, title: 'Sorting Algorithms Worksheet', teacher: 'Dr. Emily Chen', course: 'Data Structures', date: '2026-03-14', status: 'Approved' },
          { id: 4, title: 'AWS Deployment Guide', teacher: 'Prof. Mike Johnson', course: 'Cloud Computing', date: '2026-03-13', status: 'Rejected' },
          { id: 5, title: 'TensorFlow Tutorial Series', teacher: 'Dr. Lisa Wang', course: 'Machine Learning', date: '2026-03-12', status: 'Pending' },
          { id: 6, title: 'Graph Theory Problem Set', teacher: 'Dr. Emily Chen', course: 'Data Structures', date: '2026-03-11', status: 'Approved' },
          { id: 7, title: 'Docker Containerization Lab', teacher: 'Prof. Mike Johnson', course: 'Cloud Computing', date: '2026-03-10', status: 'Revision Requested' },
        ]
      }
    };
  },

  // ─── Student Engagement ─────────────────────────────────────
  getStudentEngagement: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        activityPerCourse: [
          { name: 'Advanced AI', activeStudents: 85, totalStudents: 120, avgScore: 78 },
          { name: 'Data Structures', activeStudents: 110, totalStudents: 140, avgScore: 72 },
          { name: 'Cloud Computing', activeStudents: 65, totalStudents: 95, avgScore: 81 },
          { name: 'Machine Learning', activeStudents: 92, totalStudents: 130, avgScore: 76 },
          { name: 'Web Dev', activeStudents: 78, totalStudents: 100, avgScore: 84 },
        ],
        avgStudyHours: [
          { name: 'Mon', hours: 3.2 },
          { name: 'Tue', hours: 4.1 },
          { name: 'Wed', hours: 3.8 },
          { name: 'Thu', hours: 4.5 },
          { name: 'Fri', hours: 3.0 },
          { name: 'Sat', hours: 5.2 },
          { name: 'Sun', hours: 4.8 },
        ],
        aiAssistantUsage: [
          { name: 'Week 1', queries: 320, notesGenerated: 85, quizzesTaken: 45 },
          { name: 'Week 2', queries: 480, notesGenerated: 120, quizzesTaken: 68 },
          { name: 'Week 3', queries: 560, notesGenerated: 145, quizzesTaken: 82 },
          { name: 'Week 4', queries: 620, notesGenerated: 165, quizzesTaken: 95 },
          { name: 'Week 5', queries: 710, notesGenerated: 190, quizzesTaken: 110 },
          { name: 'Week 6', queries: 780, notesGenerated: 210, quizzesTaken: 125 },
        ],
      }
    };
  },

  // ─── Approval Mutations ─────────────────────────────────────
  approveMaterial: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Approved' } };
  },
  rejectMaterial: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Rejected' } };
  },
  requestMaterialRevision: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Revision Requested' } };
  },

  // ─── Legacy (kept for backward compatibility) ───────────────
  getAnalytics: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        courseActivity: [
          { name: 'Week 1', activeCourses: 120, notesUploaded: 45 },
          { name: 'Week 2', activeCourses: 130, notesUploaded: 60 },
          { name: 'Week 3', activeCourses: 145, notesUploaded: 80 },
          { name: 'Week 4', activeCourses: 156, notesUploaded: 110 },
        ],
        studentEngagement: [
          { name: 'Week 1', participation: 60, aiUsage: 40 },
          { name: 'Week 2', participation: 75, aiUsage: 55 },
          { name: 'Week 3', participation: 80, aiUsage: 70 },
          { name: 'Week 4', participation: 85, aiUsage: 90 },
        ]
      }
    };
  },
  getCourseApprovals: async () => {
    await delay(MOCK_DELAY);
    return {
      data: {
        approvals: [
          { id: 1, title: 'Advanced Neural Networks', teacher: 'Dr. Sarah Smith', date: '2026-03-14', type: 'Course Material', status: 'Pending' },
          { id: 2, title: 'React Performance Tuning', teacher: 'Prof. John Doe', date: '2026-03-12', type: 'Lecture Notes', status: 'Pending' },
          { id: 3, title: 'Data Structures in Python', teacher: 'Dr. Emily Chen', date: '2026-03-10', type: 'Assignment', status: 'Approved' },
          { id: 4, title: 'Cloud Architecture', teacher: 'Prof. Mike Johnson', date: '2026-03-09', type: 'Video Lecture', status: 'Rejected' },
        ]
      }
    };
  },
  approveCourse: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Approved' } };
  },
  rejectCourse: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Rejected' } };
  },
  requestRevision: async (id) => {
    await delay(MOCK_DELAY);
    return { data: { success: true, id, status: 'Revision Requested' } };
  }
};
