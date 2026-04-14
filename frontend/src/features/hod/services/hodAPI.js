// hodAPI.js
// All endpoints require backend implementation

import { projectsApi } from '@/services/api';

const notImplemented = () => {
  throw new Error('HOD API endpoints not implemented. Please configure backend endpoints.');
};

export const hodAPI = {
  getDashboard: notImplemented,
  getPerformance: notImplemented,
  getTeacherContributions: notImplemented,
  getMaterialApprovals: notImplemented,
  getStudentEngagement: notImplemented,
  getProjectApprovals: async () => {
    const response = await projectsApi.all();
    return {
      data: {
        approvals: (response.data || []),
      }
    };
  },
  approveMaterial: notImplemented,
  rejectMaterial: notImplemented,
  requestMaterialRevision: notImplemented,
  approveProject: (id) => projectsApi.approve(id),
  rejectProject: (id) => projectsApi.reject(id),
  getAnalytics: notImplemented,
  getCourseApprovals: notImplemented,
  approveCourse: notImplemented,
  rejectCourse: notImplemented,
  requestRevision: notImplemented,
};
