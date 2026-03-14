import { authApi } from "@/api";
import { storageService } from "./storage.service";

export const authService = {
  async login(credentials) {
    const { data } = await authApi.login(credentials);
    storageService.setToken(data.access);
    storageService.setRefreshToken(data.refresh);
    return data;
  },
  logout() {
    storageService.clearTokens();
  },
  isAuthenticated() {
    return !!storageService.getToken();
  },
};
