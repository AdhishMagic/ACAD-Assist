import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hodAPI } from '../services/hodAPI';

// ─── Dashboard ───────────────────────────────────────────────
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['hod-dashboard'],
    queryFn: async () => {
      const response = await hodAPI.getDashboard();
      return response.data;
    }
  });
};

// ─── Performance ─────────────────────────────────────────────
export const usePerformanceData = () => {
  return useQuery({
    queryKey: ['hod-performance'],
    queryFn: async () => {
      const response = await hodAPI.getPerformance();
      return response.data;
    }
  });
};

// ─── Teacher Contributions ──────────────────────────────────
export const useTeacherContributions = (filters = {}) => {
  return useQuery({
    queryKey: ['hod-teacher-contributions', filters],
    queryFn: async () => {
      const response = await hodAPI.getTeacherContributions(filters);
      return response.data;
    }
  });
};

// ─── Material Approvals ─────────────────────────────────────
export const useMaterialApprovals = () => {
  return useQuery({
    queryKey: ['hod-material-approvals'],
    queryFn: async () => {
      const response = await hodAPI.getMaterialApprovals();
      return response.data;
    }
  });
};

// ─── Student Engagement ─────────────────────────────────────
export const useStudentEngagement = () => {
  return useQuery({
    queryKey: ['hod-student-engagement'],
    queryFn: async () => {
      const response = await hodAPI.getStudentEngagement();
      return response.data;
    }
  });
};

// ─── Material Approval Actions ──────────────────────────────
export const useMaterialApprovalActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id) => hodAPI.approveMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-material-approvals'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => hodAPI.rejectMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-material-approvals'] });
    }
  });

  const requestRevisionMutation = useMutation({
    mutationFn: (id) => hodAPI.requestMaterialRevision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-material-approvals'] });
    }
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    requestRevision: requestRevisionMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isRequestingRevision: requestRevisionMutation.isPending
  };
};

// ─── Legacy hooks (kept for backward compatibility) ──────────
export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ['hod-analytics'],
    queryFn: async () => {
      const response = await hodAPI.getAnalytics();
      return response.data;
    }
  });
};

export const useCourseApprovals = () => {
  return useQuery({
    queryKey: ['hod-approvals'],
    queryFn: async () => {
      const response = await hodAPI.getCourseApprovals();
      return response.data;
    }
  });
};

export const useApprovalActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id) => hodAPI.approveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-approvals'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => hodAPI.rejectCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-approvals'] });
    }
  });

  const requestRevisionMutation = useMutation({
    mutationFn: (id) => hodAPI.requestRevision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hod-approvals'] });
    }
  });

  return {
    approve: approveMutation.mutate,
    reject: rejectMutation.mutate,
    requestRevision: requestRevisionMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isRequestingRevision: requestRevisionMutation.isPending
  };
};
