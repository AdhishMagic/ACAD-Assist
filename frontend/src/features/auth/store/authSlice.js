import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_ROLE, normalizeRole, normalizeUserRole } from '../utils/role';

const getInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    const activeRole = localStorage.getItem('activeRole');
    const parsedUser = normalizeUserRole(user ? JSON.parse(user) : null);
    const role = normalizeRole(activeRole || parsedUser?.role) || (token ? DEFAULT_ROLE : null);
    return {
      user: parsedUser,
      token: token ? token : null,
      refreshToken: refreshToken ? refreshToken : null,
      isAuthenticated: !!token,
      activeRole: role,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      activeRole: null,
    };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      const normalizedUser = normalizeUserRole(user);
      const normalizedRole = normalizeRole(normalizedUser?.role) || DEFAULT_ROLE;

      state.user = {
        ...normalizedUser,
        role: normalizedRole,
      };
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.activeRole = normalizedRole;
      localStorage.setItem('user', JSON.stringify(state.user));
      localStorage.setItem('token', token);
      localStorage.setItem('access_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        localStorage.removeItem('refresh_token');
      }
      if (normalizedRole) {
        localStorage.setItem('activeRole', normalizedRole);
      } else {
        localStorage.removeItem('activeRole');
      }
    },
    setActiveRole: (state, action) => {
      const normalizedRole = normalizeRole(action.payload);
      state.activeRole = normalizedRole;
      if (normalizedRole) {
        localStorage.setItem('activeRole', normalizedRole);
      } else {
        localStorage.removeItem('activeRole');
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.activeRole = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('activeRole');
    },

    updateCurrentUser: (state, action) => {
      const patch = action.payload || {};
      const normalizedPatch = {
        ...patch,
        role: Object.prototype.hasOwnProperty.call(patch, 'role')
          ? normalizeRole(patch.role) || DEFAULT_ROLE
          : state.user?.role || DEFAULT_ROLE,
      };
      state.user = state.user ? { ...state.user, ...normalizedPatch } : { ...normalizedPatch };
      try {
        localStorage.setItem('user', JSON.stringify(state.user));
      } catch {
        // ignore storage failures
      }
    },
  },
});

export const { setCredentials, setActiveRole, logout, updateCurrentUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectActiveRole = (state) => state.auth.activeRole;

export default authSlice.reducer;
