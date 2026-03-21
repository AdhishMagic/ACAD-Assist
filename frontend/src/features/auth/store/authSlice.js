import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const activeRole = localStorage.getItem('activeRole');
    const pendingRole = localStorage.getItem('pendingRole');
    return {
      user: user ? JSON.parse(user) : null,
      token: token ? token : null,
      isAuthenticated: !!token,
      activeRole: activeRole ? activeRole : null,
      pendingRole: pendingRole ? pendingRole : null,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      activeRole: null,
      pendingRole: null,
    };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // activeRole is chosen pre-login (pendingRole) and applied on success.
      state.activeRole = null;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.removeItem('activeRole');
    },
    setPendingRole: (state, action) => {
      state.pendingRole = action.payload;
      if (action.payload) {
        localStorage.setItem('pendingRole', action.payload);
      } else {
        localStorage.removeItem('pendingRole');
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
      state.isAuthenticated = false;
      state.activeRole = null;
      state.pendingRole = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('activeRole');
      localStorage.removeItem('pendingRole');
    },
  },
});

export const { setCredentials, setPendingRole, setActiveRole, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectActiveRole = (state) => state.auth.activeRole;
export const selectPendingRole = (state) => state.auth.pendingRole;

export default authSlice.reducer;
