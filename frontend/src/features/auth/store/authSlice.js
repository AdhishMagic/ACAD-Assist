import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_ROLE, normalizeRole, normalizeUserRole } from '../utils/role';

function hasStoredAccessToken() {
  try {
    return Boolean(localStorage.getItem('access_token') || localStorage.getItem('token'));
  } catch {
    return false;
  }
}

const getInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    const isAuthenticated = hasStoredAccessToken();
    const activeRole = localStorage.getItem('activeRole');
    const parsedUser = normalizeUserRole(user ? JSON.parse(user) : null);
    const role = normalizeRole(activeRole || parsedUser?.role) || (isAuthenticated ? DEFAULT_ROLE : null);
    return {
      user: parsedUser,
      isAuthenticated,
      activeRole: role,
    };
  } catch (error) {
    return {
      user: null,
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
      state.isAuthenticated = Boolean(token);
      state.activeRole = normalizedRole;
      localStorage.setItem('user', JSON.stringify(state.user));
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
      }
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
    syncAuthFromStorage: (state) => {
      state.isAuthenticated = hasStoredAccessToken();
      if (!state.isAuthenticated) {
        state.activeRole = null;
      }
    },
    logout: (state) => {
      state.user = null;
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

export const { setCredentials, setActiveRole, syncAuthFromStorage, logout, updateCurrentUser } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectActiveRole = (state) => state.auth.activeRole;

export default authSlice.reducer;
