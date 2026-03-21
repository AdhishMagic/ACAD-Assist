import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function RoleGuard({ allowedRoles, children }) {
  const { isAuthenticated, activeRole } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!activeRole) {
    return <Navigate to="/choose-role" replace />;
  }

  if (!allowedRoles.includes(activeRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
