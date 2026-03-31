import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    const activeRole = localStorage.getItem('activeRole');
    const parsedUser = user ? JSON.parse(user) : null;
    const role = activeRole || parsedUser?.role || null;
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
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true;
      state.activeRole = user?.role || null;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('access_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        localStorage.removeItem('refresh_token');
      }
      if (user?.role) {
        localStorage.setItem('activeRole', user.role);
      } else {
        localStorage.removeItem('activeRole');
      }
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      if (action.payload) {
        localStorage.setItem('activeRole', action.payload);
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
      state.user = state.user ? { ...state.user, ...patch } : { ...patch };
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
