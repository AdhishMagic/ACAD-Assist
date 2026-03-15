// hodAPI.js
// Mock implementations are provided to prevent proxy errors, aligning with previous features.

const MOCK_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hodAPI = {
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
        teacherContributions: [
          { id: 1, name: "Dr. Sarah Smith", coursesHandled: 4, notesUploaded: 45, aiMaterialsGenerated: 120 },
          { id: 2, name: "Prof. John Doe", coursesHandled: 3, notesUploaded: 30, aiMaterialsGenerated: 85 },
          { id: 3, name: "Dr. Emily Chen", coursesHandled: 5, notesUploaded: 60, aiMaterialsGenerated: 150 },
        ]
      }
    };
  },
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
          { id: 1, title: "Advanced Neural Networks", teacher: "Dr. Sarah Smith", date: "2026-03-14", type: "Course Material", status: "Pending" },
          { id: 2, title: "React Performance Tuning", teacher: "Prof. John Doe", date: "2026-03-12", type: "Lecture Notes", status: "Pending" },
          { id: 3, title: "Data Structures in Python", teacher: "Dr. Emily Chen", date: "2026-03-10", type: "Assignment", status: "Approved" },
          { id: 4, title: "Cloud Architecture", teacher: "Prof. Mike Johnson", date: "2026-03-09", type: "Video Lecture", status: "Rejected" },
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
