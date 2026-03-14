import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, registerThunk, logoutThunk, getProfileThunk } from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user; state.isAuthenticated = true; })
      .addCase(loginThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(registerThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(logoutThunk.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; })
      .addCase(getProfileThunk.fulfilled, (state, action) => { state.user = action.payload; state.isAuthenticated = true; })
      .addCase(getProfileThunk.rejected, (state) => { state.user = null; state.isAuthenticated = false; });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
