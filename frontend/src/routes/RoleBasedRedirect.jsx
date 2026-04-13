import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { DEFAULT_ROLE, getHomePathForRole, normalizeRole } from '@/features/auth/utils/role';

export function RoleBasedRedirect() {
  const { user, isAuthenticated, activeRole } = useSelector((state) => state.auth);
  const role = normalizeRole(activeRole || user?.role) || DEFAULT_ROLE;

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <Navigate to={getHomePathForRole(role)} replace />;
}
