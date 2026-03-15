import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated, logout } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    logout: handleLogout,
  };
};
