import { isMockMode } from '@/shared/lib/http/apiMode';
import {
  mockAIUsage,
  mockAnalyticsSummary,
  mockLearningInsights,
  mockStudyHours,
  mockSubjectProgress,
} from '@/shared/mocks/studentAnalytics.mock';

export const analyticsAPI = {
  getSummary: async () => {
    if (!isMockMode) {
      // TODO: Replace with live endpoint when backend analytics API is available.
    }
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockAnalyticsSummary };
  },
  
  getStudyHours: async () => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return { data: mockStudyHours };
  },

  getSubjectProgress: async () => {
    await new Promise(resolve => setTimeout(resolve, 900));
    return { data: mockSubjectProgress };
  },

  getAIUsage: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: mockAIUsage };
  },

  getInsights: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockLearningInsights };
  }
};
