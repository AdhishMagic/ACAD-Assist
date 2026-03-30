import { getDisplayNameFromUser, toTitleCase } from "@/utils/helpers";
import { apiClient } from "@/shared/lib/http/axios";
import { delay, shouldFallbackToMock } from "@/shared/lib/http/apiMode";

const getStoredAuthUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredActiveRole = () => {
  try {
    return localStorage.getItem("activeRole");
  } catch {
    return null;
  }
};

export const profileAPI = {
  getProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(150);
        const user = getStoredAuthUser();
        const activeRole = getStoredActiveRole();
        const roleRaw = activeRole || user?.role || "student";

        return {
          id: user?.id ?? "u123",
          name: getDisplayNameFromUser(user) || "User",
          email: user?.email || "",
          role: toTitleCase(roleRaw),
          joinDate: user?.date_joined || user?.created_at || "2025-09-01",
          avatarUrl: user?.avatar || user?.avatarUrl || null,
          stats: {
            coursesEnrolled: 4,
            notesSaved: 12,
            testsTaken: 3,
          },
        };
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await apiClient.put('/user/profile', data);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(300);
        try {
          const user = getStoredAuthUser() || {};
          const next = { ...user, ...(data || {}) };
          localStorage.setItem("user", JSON.stringify(next));
        } catch {
          // ignore storage failures
        }
        return { success: true };
    }
  },
  updatePassword: async (data) => {
    try {
      const response = await apiClient.put('/user/password', data);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(500);
      return { success: true };
    }
  }
};
