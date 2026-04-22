import { apiClient } from '@/shared/lib/http/axios';

const getAnalyticsPayload = async () => {
  const response = await apiClient.get('/api/student/overview/');
  return response.data || {};
};

export const analyticsAPI = {
  getOverview: async () => ({ data: await getAnalyticsPayload() }),
  getSummary: async () => ({ data: (await getAnalyticsPayload()).summary || null }),
  getStudyHours: async () => ({ data: (await getAnalyticsPayload()).studyHours || [] }),
  getSubjectProgress: async () => ({
    data: (await getAnalyticsPayload()).subjectProgressDetailed || [],
  }),
  getAIUsage: async () => ({ data: (await getAnalyticsPayload()).aiUsage || [] }),
  getInsights: async () => ({ data: (await getAnalyticsPayload()).insights || [] }),
};
