import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hodAPI } from '../services/hodAPI';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['hod-dashboard'],
    queryFn: async () => {
      const response = await hodAPI.getDashboard();
      return response.data;
    }
  });
};

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
