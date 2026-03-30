import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { logout, selectCurrentUser, selectIsAuthenticated } from "@/features/auth/store/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const logoutUser = useCallback(() => dispatch(logout()), [dispatch]);

  return { user, isAuthenticated, logout: logoutUser };
}
