import axios from 'axios';

// Mock data to simulate API responses

const mockAnalyticsSummary = {
  totalStudyHours: 124.5,
  notesCompleted: 48,
  aiQuestionsAsked: 312,
  subjectsStudied: 6
};

const mockStudyHours = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 5.5 },
  { day: 'Sun', hours: 1.0 },
];

const mockSubjectProgress = [
  { subject: 'Computer Networks', progress: 75, color: 'bg-blue-500' },
  { subject: 'Operating Systems', progress: 45, color: 'bg-indigo-500' },
  { subject: 'Database Systems', progress: 90, color: 'bg-violet-500' },
  { subject: 'Data Structures', progress: 60, color: 'bg-purple-500' },
];

const mockAIUsage = [
  { date: 'Mon', questions: 12, tokens: 4500 },
  { date: 'Tue', questions: 18, tokens: 6200 },
  { date: 'Wed', questions: 8, tokens: 2100 },
  { date: 'Thu', questions: 25, tokens: 8900 },
  { date: 'Fri', questions: 15, tokens: 5400 },
  { date: 'Sat', questions: 30, tokens: 12000 },
  { date: 'Sun', questions: 5, tokens: 1800 },
];

const mockLearningInsights = [
  {
    id: 1,
    type: 'success',
    title: 'Peak Productivity',
    message: 'You study most effectively between 8 PM and 11 PM. Try scheduling your hardest subjects during this time.',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Attention Needed',
    message: 'Your progress in Operating Systems is lagging behind others. Focus more on this subject this week.',
  },
  {
    id: 3,
    type: 'info',
    title: 'Review Recommendation',
    message: 'It has been 5 days since you reviewed Computer Networks. A quick recap might help memory retention.',
  }
];

export const analyticsAPI = {
  getSummary: async () => {
    // Simulate delay
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
