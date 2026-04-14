import { apiClient } from "@/shared/lib/http/axios";

export const getSettings = async () => {
  const { data } = await apiClient.get("/user/settings");
  return data;
};

export const updateSettings = async (settingsPayload) => {
  const { data } = await apiClient.put("/user/settings", settingsPayload);
  return data;
};

export const updatePassword = async (passwordPayload) => {
  const { data } = await apiClient.put("/user/password", passwordPayload);
  return data;
};
