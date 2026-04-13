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
      return '/admin/dashboard';
    case 'hod':
      return '/hod/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'system':
      return '/system/dashboard';
    case 'student':
    default:
      return '/student/dashboard';
  }
}