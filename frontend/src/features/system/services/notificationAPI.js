import { apiClient } from "@/shared/lib/http/axios";

export const notificationAPI = {
  getNotifications: async ({ pageParam = 1, pageSize = 20 } = {}) => {
    const response = await apiClient.get(`/api/notifications?page=${pageParam}&page_size=${pageSize}`);
    return response.data;
  },
  markAsRead: async (id) => {
    await apiClient.put(`/api/notifications/${id}/read/`);
    return { success: true };
  },
  markAllAsRead: async () => {
    await apiClient.put("/api/notifications/read-all/");
    return { success: true };
  }
};
