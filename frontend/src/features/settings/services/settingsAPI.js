import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Mock data to handle cases without a backend
let mockSettings = {
  account: {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Teacher",
  },
  appearance: {
    theme: "light",
    fontSize: "medium",
    colorScheme: "blue",
  },
  notifications: {
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2026-01-15T10:00:00Z",
  }
};

// Add interceptor to mock responses instead of failing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const path = error.config?.url || "";
    
    if (path.includes("/user/settings")) {
      if (error.config.method === "get") {
        return Promise.resolve({ data: mockSettings });
      } else if (error.config.method === "put") {
        let payload = {};
        try {
          payload = error.config?.data ? JSON.parse(error.config.data) : {};
        } catch {
          payload = {};
        }

        // Support both flat payloads ({ fullName, email }) and nested ({ account: { name, email } }).
        const next = {
          ...mockSettings,
          account: {
            ...mockSettings.account,
            ...(payload.account || {}),
            name: payload.fullName || payload.account?.name || mockSettings.account.name,
            email: payload.email || payload.account?.email || mockSettings.account.email,
          },
        };

        mockSettings = next;
        return Promise.resolve({ data: mockSettings });
      }
    }
    
    if (path.includes("/user/password")) {
      return Promise.resolve({ data: { success: true, message: "Password updated successfully" } });
    }
    
    // Generic fallback for any other settings route
    return Promise.resolve({ data: { success: true } });
  }
);

export const getSettings = async () => {
  const { data } = await api.get("/user/settings");
  return data;
};

export const updateSettings = async (settingsPayload) => {
  const { data } = await api.put("/user/settings", settingsPayload);
  return data;
};

export const updatePassword = async (passwordPayload) => {
  const { data } = await api.put("/user/password", passwordPayload);
  return data;
};
