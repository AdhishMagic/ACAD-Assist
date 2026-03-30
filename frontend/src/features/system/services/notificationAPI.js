import { apiClient } from "@/shared/lib/http/axios";
import { delay, shouldFallbackToMock } from "@/shared/lib/http/apiMode";
import { mockNotifications } from "@/shared/mocks/system.mock";

export const notificationAPI = {
  getNotifications: async ({ pageParam = 1 }) => {
    try {
      const response = await apiClient.get(`/notifications?page=${pageParam}`);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(500);
      return {
        data: mockNotifications,
        nextPage: pageParam < 3 ? pageParam + 1 : null,
      };
    }
  },
  markAsRead: async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      return { success: true };
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(200);
      return { success: true };
    }
  },
  markAllAsRead: async () => {
    try {
      await apiClient.put('/notifications/read-all');
      return { success: true };
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(300);
      return { success: true };
    }
  }
};
