import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

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
