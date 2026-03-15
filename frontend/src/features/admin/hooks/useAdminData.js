import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/adminAPI';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const { data } = await adminAPI.getDashboardStats();
      return data;
    },
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const { data } = await adminAPI.getSystemAnalytics();
      return data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data } = await adminAPI.getUsers();
      return data;
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, newRole }) => adminAPI.updateUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, status }) => adminAPI.toggleUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: (userId) => adminAPI.resetUserPassword(userId),
  });
};
