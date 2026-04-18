import { useQuery } from '@tanstack/react-query';
import { studentAPI } from '../services/studentAPI';

export const useStudentDashboard = (userId) => {
  return useQuery({
    queryKey: ['studentDashboard', userId || 'anonymous'],
    queryFn: studentAPI.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(userId),
  });
};

export const useStudentOverview = (userId) => {
  return useQuery({
    queryKey: ['studentOverview', userId || 'anonymous'],
    queryFn: studentAPI.getOverview,
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId),
  });
};

export const useRecentNotes = () => {
  return useQuery({
    queryKey: ['studentRecentNotes'],
    queryFn: studentAPI.getRecentNotes,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingTests = () => {
  return useQuery({
    queryKey: ['studentUpcomingTests'],
    queryFn: studentAPI.getUpcomingTests,
    staleTime: 5 * 60 * 1000,
  });
};
