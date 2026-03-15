import { useQuery } from '@tanstack/react-query';
import { studentAPI } from '../services/studentAPI';

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: studentAPI.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudentOverview = () => {
  return useQuery({
    queryKey: ['studentOverview'],
    queryFn: studentAPI.getOverview,
    staleTime: 5 * 60 * 1000,
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
