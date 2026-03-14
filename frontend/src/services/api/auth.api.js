import api from "./axios";

export const authApi = {
  login: (credentials) => api.post("/auth/login/", credentials),
  register: (userData) => api.post("/auth/register/", userData),
  logout: () => api.post("/auth/logout/"),
  refreshToken: (refresh) => api.post("/auth/token/refresh/", { refresh }),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),
  forgotPassword: (email) => api.post("/auth/password/reset/", { email }),
  resetPassword: (data) => api.post("/auth/password/reset/confirm/", data),
};
