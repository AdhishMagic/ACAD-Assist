const notImplemented = () => {
  throw new Error('Analytics API endpoints not implemented. Please configure backend endpoints.');
};

export const analyticsAPI = {
  getSummary: notImplemented,
  getStudyHours: notImplemented,
  getSubjectProgress: notImplemented,
  getAIUsage: notImplemented,
  getInsights: notImplemented,
};
