import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DEFAULT_ROLE, getHomePathForRole, normalizeRole } from "@/features/auth/utils/role";

export function RoleGuard({ allowedRoles, children }) {
  const { isAuthenticated, activeRole, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const role = normalizeRole(activeRole || user?.role) || (isAuthenticated ? DEFAULT_ROLE : null);
  const normalizedAllowedRoles = Array.isArray(allowedRoles)
    ? allowedRoles.map((item) => normalizeRole(item)).filter(Boolean)
    : [];

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

  if (!normalizedAllowedRoles.length) {
    return children ? children : <Outlet />;
  }

  if (!normalizedAllowedRoles.includes(role)) {
    const homePath = getHomePathForRole(role);

    // Safety fallback: avoid infinite redirects if this guard is mounted on the same target path.
    if (location.pathname === homePath) {
      return null;
    }

    return <Navigate to={homePath} replace />;
  }

  return children ? children : <Outlet />;
}
