import { useSelector } from 'react-redux';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { getHomePathForRole, normalizeRole } from '@/features/auth/utils/role';

export function useHomePath() {
  const { user, isAuthenticated, activeRole } = useSelector((state) => state.auth);
  const role = normalizeRole(activeRole || user?.role);

  return isAuthenticated ? getHomePathForRole(role) : ROUTE_PATHS.ROOT;
}
