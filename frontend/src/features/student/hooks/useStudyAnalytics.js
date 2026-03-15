import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/analyticsAPI';

export const useStudyAnalytics = () => {
  const summaryQuery = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await analyticsAPI.getSummary();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const studyHoursQuery = useQuery({
    queryKey: ['analytics', 'studyHours'],
    queryFn: async () => {
      const response = await analyticsAPI.getStudyHours();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const subjectProgressQuery = useQuery({
    queryKey: ['analytics', 'subjectProgress'],
    queryFn: async () => {
      const response = await analyticsAPI.getSubjectProgress();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const aiUsageQuery = useQuery({
    queryKey: ['analytics', 'aiUsage'],
    queryFn: async () => {
      const response = await analyticsAPI.getAIUsage();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const insightsQuery = useQuery({
    queryKey: ['analytics', 'insights'],
    queryFn: async () => {
      const response = await analyticsAPI.getInsights();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = 
    summaryQuery.isLoading || 
    studyHoursQuery.isLoading || 
    subjectProgressQuery.isLoading || 
    aiUsageQuery.isLoading || 
    insightsQuery.isLoading;

  const isError = 
    summaryQuery.isError || 
    studyHoursQuery.isError || 
    subjectProgressQuery.isError || 
    aiUsageQuery.isError || 
    insightsQuery.isError;

  return {
    summary: summaryQuery.data,
    studyHours: studyHoursQuery.data,
    subjectProgress: subjectProgressQuery.data,
    aiUsage: aiUsageQuery.data,
    insights: insightsQuery.data,
    isLoading,
    isError,
    refetchAll: () => {
      summaryQuery.refetch();
      studyHoursQuery.refetch();
      subjectProgressQuery.refetch();
      aiUsageQuery.refetch();
      insightsQuery.refetch();
    }
  };
};
