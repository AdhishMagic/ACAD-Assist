// hodAPI.js
// All endpoints require backend implementation

import { projectsApi } from '@/services/api';
import { apiClient } from '@/shared/lib/http/axios';

const notImplemented = () => {
  throw new Error('HOD API endpoints not implemented. Please configure backend endpoints.');
};

export const hodAPI = {
  getDashboard: notImplemented,
  getPerformance: notImplemented,
  getTeacherContributions: notImplemented,
  getMaterialApprovals: async () => {
    try {
      const response = await apiClient.get('/api/materials/');
      const materials = Array.isArray(response.data) ? response.data : response.data?.results || [];
      
      // Transform materials data to match CourseApprovalTable structure
      const approvals = materials.map(material => ({
        id: material.id,
        title: material.title,
        teacher: material.author_name || material.uploaded_by_email || 'Unknown',
        course: 'Study Material', // StudyMaterial doesn't have course field
        date: material.created_at ? new Date(material.created_at).toLocaleDateString() : 'N/A',
        status: material.status || 'Pending',
        // Include original data for details dialog
        ...material,
      }));
      
      return {
        data: {
          approvals,
        }
      };
    } catch (error) {
      console.error('Failed to load saved materials:', error);
      return {
        data: {
          approvals: [],
        }
      };
    }
  },
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
