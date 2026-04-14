import { apiClient } from "@/shared/lib/http/axios";

export const notificationAPI = {
  getNotifications: async ({ pageParam = 1 }) => {
    const response = await apiClient.get(`/notifications?page=${pageParam}`);
    return response.data;
  },
  markAsRead: async (id) => {
    await apiClient.put(`/notifications/${id}/read`);
    return { success: true };
  },
  markAllAsRead: async () => {
    await apiClient.put('/notifications/read-all');
    return { success: true };
  }
};
