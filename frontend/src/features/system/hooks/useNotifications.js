import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "../services/notificationAPI";

export const useNotifications = ({ pageSize = 20, refetchInterval = false, enabled = true } = {}) => {
  return useInfiniteQuery({
    queryKey: ["notifications", pageSize],
    queryFn: ({ pageParam = 1 }) => notificationAPI.getNotifications({ pageParam, pageSize }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    refetchInterval,
    enabled,
  });
};

export const useNotificationSummary = ({ pageSize = 10, refetchInterval = 15000, enabled = true } = {}) => {
  return useQuery({
    queryKey: ["notifications", "summary", pageSize],
    queryFn: () => notificationAPI.getNotifications({ pageParam: 1, pageSize }),
    refetchInterval,
    enabled,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationAPI.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
