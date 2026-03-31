import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function RoleGuard({ allowedRoles, children }) {
  const { isAuthenticated, activeRole, user } = useSelector((state) => state.auth);
  const role = activeRole || user?.role || null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Admin is treated as a super-role with access to all feature areas.
  if (role === 'admin') {
    return children ? children : <Outlet />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
