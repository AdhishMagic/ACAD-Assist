import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function RoleBasedRedirect() {
  const { user, isAuthenticated, activeRole } = useSelector((state) => state.auth);
  const role = activeRole || user?.role || 'student';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'hod':
      return <Navigate to="/hod/dashboard" replace />;
    case 'teacher':
      return <Navigate to="/teacher/dashboard" replace />;
    case 'system':
      return <Navigate to="/system/dashboard" replace />;
    case 'student':
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
}
