import { apiClient } from "@/shared/lib/http/axios";
import { isMockMode, shouldFallbackToMock } from "@/shared/lib/http/apiMode";
import { mockSettingsInitial } from "@/shared/mocks/settings.mock";

let mockSettings = { ...mockSettingsInitial };

function updateMockSettings(settingsPayload) {
  const payload = settingsPayload || {};
  const next = {
    ...mockSettings,
    account: {
      ...mockSettings.account,
      ...(payload.account || {}),
      name: payload.fullName || payload.account?.name || mockSettings.account.name,
      email: payload.email || payload.account?.email || mockSettings.account.email,
      avatarUrl: payload.avatarUrl || payload.account?.avatarUrl || mockSettings.account.avatarUrl,
    },
    appearance: {
      ...mockSettings.appearance,
      ...(payload.appearance || {}),
      theme: payload.appearance?.theme || payload.theme || mockSettings.appearance?.theme || "system",
    },
  };

  mockSettings = next;
  return mockSettings;
}

export const getSettings = async () => {
  if (isMockMode) return mockSettings;

  try {
    const { data } = await apiClient.get("/user/settings");
    return data;
  } catch (error) {
    if (!shouldFallbackToMock(error)) throw error;
    return mockSettings;
  }
};

export const updateSettings = async (settingsPayload) => {
  if (isMockMode) return updateMockSettings(settingsPayload);

  try {
    const { data } = await apiClient.put("/user/settings", settingsPayload);
    return data;
  } catch (error) {
    if (!shouldFallbackToMock(error)) throw error;
    return updateMockSettings(settingsPayload);
  }
};

export const updatePassword = async (passwordPayload) => {
  if (isMockMode) return { success: true, message: "Password updated successfully" };

  try {
    const { data } = await apiClient.put("/user/password", passwordPayload);
    return data;
  } catch (error) {
    if (!shouldFallbackToMock(error)) throw error;
    return { success: true, message: "Password updated successfully" };
  }
};
