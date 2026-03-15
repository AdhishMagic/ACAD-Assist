import { useQuery, useMutation } from '@tanstack/react-query';
import { teacherAPI } from '../services/teacherAPI';

export const useTeacherDashboard = () => {
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    error: dashboardError 
  } = useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: () => teacherAPI.getDashboardData().then(res => res.data),
  });

  return {
    dashboardData,
    isDashboardLoading,
    dashboardError
  };
};

export const useTeacherClasses = () => {
  const {
    data: classesData,
    isLoading: isClassesLoading,
    error: classesError
  } = useQuery({
    queryKey: ['teacherClasses'],
    queryFn: () => teacherAPI.getClasses().then(res => res.data),
  });

  return {
    classesData,
    isClassesLoading,
    classesError
  };
};

export const useStudentActivity = () => {
  const {
    data: activityData,
    isLoading: isActivityLoading,
    error: activityError
  } = useQuery({
    queryKey: ['studentActivity'],
    queryFn: () => teacherAPI.getStudentActivity().then(res => res.data),
  });

  return {
    activityData,
    isActivityLoading,
    activityError
  };
};

export const useUploadNotes = () => {
  return useMutation({
    mutationFn: (formData) => teacherAPI.uploadNotes(formData)
  });
};
