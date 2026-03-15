import axios from "axios";

// Mock axios instance or configure your base axios instance here
const api = axios.create({
  baseURL: "/api" // Adjust to actual API base URL
});

export const notificationAPI = {
  getNotifications: async ({ pageParam = 1 }) => {
    // In a real app, you would fetch from the API and handle pagination
    // const response = await api.get(`/notifications?page=${pageParam}`);
    // return response.data;

    // Mock response for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 1, type: "announcement", message: "System maintenance at midnight", read: false, date: "2026-03-15T10:00:00Z" },
            { id: 2, type: "alert", message: "New notes uploaded for CS101", read: true, date: "2026-03-14T14:30:00Z" },
            { id: 3, type: "ai", message: "AI response ready for your query", read: false, date: "2026-03-15T09:15:00Z" },
            { id: 4, type: "test", message: "Test results available for Math 202", read: true, date: "2026-03-10T08:00:00Z" },
          ],
          nextPage: pageParam < 3 ? pageParam + 1 : null,
        });
      }, 500);
    });
  },
  markAsRead: async (id) => {
    // await api.put(`/notifications/${id}/read`);
    return new Promise(resolve => setTimeout(resolve, 200));
  },
  markAllAsRead: async () => {
    // await api.put('/notifications/read-all');
    return new Promise(resolve => setTimeout(resolve, 300));
  }
};
