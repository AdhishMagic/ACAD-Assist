import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { loginThunk, registerThunk, logoutThunk, getProfileThunk } from "@/features/auth/authThunks";
import { clearError } from "@/features/auth/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const login = useCallback((credentials) => dispatch(loginThunk(credentials)), [dispatch]);
  const register = useCallback((userData) => dispatch(registerThunk(userData)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);
  const fetchProfile = useCallback(() => dispatch(getProfileThunk()), [dispatch]);
  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

  return { user, isAuthenticated, isLoading, error, login, register, logout, fetchProfile, resetError };
}
