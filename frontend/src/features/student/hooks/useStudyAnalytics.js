import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../services/analyticsAPI';

export const useStudyAnalytics = () => {
  const analyticsQuery = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const response = await analyticsAPI.getOverview();
      const payload = response.data || {};

      return {
        summary: payload.summary || null,
        studyHours: payload.studyHours || [],
        subjectProgress: payload.subjectProgressDetailed || [],
        aiUsage: payload.aiUsage || [],
        insights: payload.insights || [],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    summary: analyticsQuery.data?.summary,
    studyHours: analyticsQuery.data?.studyHours,
    subjectProgress: analyticsQuery.data?.subjectProgress,
    aiUsage: analyticsQuery.data?.aiUsage,
    insights: analyticsQuery.data?.insights,
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    refetchAll: analyticsQuery.refetch,
  };
};
