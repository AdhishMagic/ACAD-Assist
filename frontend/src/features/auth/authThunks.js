import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/services/api";

export const loginThunk = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authApi.login(credentials);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.detail || "Login failed");
  }
});

export const registerThunk = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Registration failed");
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authApi.logout().catch(() => {});
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
});

export const getProfileThunk = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.getProfile();
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Failed to fetch profile");
  }
});
