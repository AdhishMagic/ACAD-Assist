import { apiClient } from '@/shared/lib/http/axios';

export const authAPI = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return {
      user: data.user,
      access: data.tokens?.access,
      refresh: data.tokens?.refresh,
    };
  },

  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return {
      user: data.user,
      access: data.tokens?.access,
      refresh: data.tokens?.refresh,
    };
  },

  forgotPassword: async (emailData) => {
    await Promise.resolve(emailData);
    return { message: 'Password reset email sent if the account exists.' };
  },
};
