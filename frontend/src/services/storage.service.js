const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const THEME_KEY = "theme";

export const storageService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_KEY, token),
  clearTokens: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); },
  getTheme: () => localStorage.getItem(THEME_KEY) || "light",
  setTheme: (theme) => localStorage.setItem(THEME_KEY, theme),
  get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return localStorage.getItem(key); } },
  set: (key, value) => localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
