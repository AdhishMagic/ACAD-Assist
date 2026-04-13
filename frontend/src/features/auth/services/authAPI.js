import { authApi } from '@/services/api';
import { getHttpErrorMessage } from '@/shared/lib/http/errorHandling';

export const authAPI = {
  login: async (credentials) => {
    console.log('POST /auth/login payload:', credentials);
    try {
      const { data } = await authApi.login(credentials);

      if (data.tokens?.access) {
        localStorage.setItem('access_token', data.tokens.access);
      }
      if (data.tokens?.refresh) {
        localStorage.setItem('refresh_token', data.tokens.refresh);
      }

      return {
        user: data.user,
        access: data.tokens?.access,
        refresh: data.tokens?.refresh,
      };
    } catch (error) {
      console.log('POST /auth/login error:', error?.response?.data || error.message);
      const message = getHttpErrorMessage(error, 'Login failed. Please check your credentials and try again.');
      throw new Error(message);
    }
  },

  register: async (userData) => {
    console.log('POST /auth/register payload:', userData);
    try {
      const { data } = await authApi.register(userData);
      return {
        user: data.user,
        access: data.tokens?.access,
        refresh: data.tokens?.refresh,
      };
    } catch (error) {
      console.log('POST /auth/register error:', error?.response?.data || error.message);
      const message = getHttpErrorMessage(error, 'Registration failed. Please try again.');
      throw new Error(message);
    }
  },

  refreshToken: async (refresh) => {
    console.log('POST /auth/token/refresh payload:', { refresh: refresh ? 'provided' : 'missing' });
    try {
      const { data } = await authApi.refreshToken(refresh);
      if (data.access) {
        localStorage.setItem('access_token', data.access);
      }
      return data;
    } catch (error) {
      console.log('POST /auth/token/refresh error:', error?.response?.data || error.message);
      const message = getHttpErrorMessage(error, 'Token refresh failed.');
      throw new Error(message);
    }
  },

  me: async () => {
    try {
      const { data } = await authApi.getProfile();
      return data;
    } catch (error) {
      console.log('GET /auth/me error:', error?.response?.data || error.message);
      const message = getHttpErrorMessage(error, 'Failed to load user profile.');
      throw new Error(message);
    }
  },

  requestRole: async (requestedRole) => {
    const payload = { requested_role: requestedRole };
    console.log('POST /auth/request-role payload:', payload);
    try {
      const { data } = await authApi.requestRole(requestedRole);
      return data;
    } catch (error) {
      console.log('POST /auth/request-role error:', error?.response?.data || error.message);
      const message = getHttpErrorMessage(error, 'Role request failed.');
      throw new Error(message);
    }
  },

  forgotPassword: async (emailData) => {
    await Promise.resolve(emailData);
    return { message: 'Password reset email sent if the account exists.' };
  },
};
