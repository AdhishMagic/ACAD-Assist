import axios from "axios";
import { getDisplayNameFromUser, toTitleCase } from "@/utils/helpers";

const api = axios.create({
  baseURL: "/api",
});

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
    // const response = await api.get('/user/profile');
    // return response.data;

    // Frontend fallback (no backend yet): derive profile from the logged-in user.
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = getStoredAuthUser();
        const activeRole = getStoredActiveRole();
        const roleRaw = activeRole || user?.role || "student";

        resolve({
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
        });
      }, 150);
    });
  },
  updateProfile: async (data) => {
    // const response = await api.put('/user/profile', data);
    // return response.data;

    // Frontend fallback: persist changes to localStorage so the UI updates.
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const user = getStoredAuthUser() || {};
          const next = { ...user, ...(data || {}) };
          localStorage.setItem("user", JSON.stringify(next));
        } catch {
          // ignore storage failures
        }
        resolve({ success: true });
      }, 300);
    });
  },
  updatePassword: async (data) => {
    // const response = await api.put('/user/password', data);
    // return response.data;
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  }
};
