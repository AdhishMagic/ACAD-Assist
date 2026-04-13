import { ROUTE_PATHS } from "@/app/routes/routePaths";

export const DEFAULT_ROLE = 'student';

export function normalizeRole(role) {
  if (role == null) {
    return null;
  }

  const value = String(role).trim().toLowerCase();

  if (!value) {
    return null;
  }

  if (value === 'faculty') {
    return 'teacher';
  }

  if (value === 'hod') {
    return 'hod';
  }

  if (value === 'student') {
    return 'student';
  }

  if (value === 'teacher') {
    return 'teacher';
  }

  if (value === 'admin') {
    return 'admin';
  }

  if (value === 'system') {
    return 'system';
  }

  return null;
}

export function normalizeUserRole(user) {
  if (!user) {
    return user;
  }

  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

export function getHomePathForRole(role) {
  const normalizedRole = normalizeRole(role) || DEFAULT_ROLE;

  switch (normalizedRole) {
    case 'admin':
      return ROUTE_PATHS.ADMIN_DASHBOARD;
    case 'hod':
      return ROUTE_PATHS.HOD_DASHBOARD;
    case 'teacher':
      return ROUTE_PATHS.TEACHER_DASHBOARD;
    case 'system':
      return ROUTE_PATHS.SYSTEM_DASHBOARD;
    case 'student':
    default:
      return ROUTE_PATHS.STUDENT_DASHBOARD;
  }
}