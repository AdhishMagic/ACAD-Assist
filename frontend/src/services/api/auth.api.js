import api from "./axios";

const AUTH_BASE_PATH = "/api/v1/auth";

function getAuthUrl(path) {
  if (typeof window === "undefined") {
    return `${AUTH_BASE_PATH}${path}`;
  }
  return `${window.location.origin}${AUTH_BASE_PATH}${path}`;
}

export const authApi = {
  login: (credentials) => api.post(getAuthUrl("/login"), credentials),
  register: (userData) => api.post(getAuthUrl("/register"), userData),
  refreshToken: (refresh) => api.post(getAuthUrl("/token/refresh"), { refresh }),
  getProfile: () => api.get(getAuthUrl("/me")),
  requestRole: (requestedRole) => api.post(getAuthUrl("/request-role"), { requested_role: requestedRole }),
  forgotPassword: (email) => api.post(getAuthUrl("/password/reset/"), { email }),
  resetPassword: (data) => api.post(getAuthUrl("/password/reset/confirm/"), data),
};
