import {
  mockActivityLogs,
  mockAiUsageStats,
  mockAnalyticsData,
  mockDashboardData,
  mockFiles,
  mockRoles,
  mockStorageStats,
  mockUsers,
  setMockFiles,
  setMockRoles,
  setMockUsers,
} from "@/shared/mocks/admin.mock";

export const adminAPI = {
  getDashboardStats: async () => {
    // return await api.get('/dashboard');
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockDashboardData }), 600));
  },

  getSystemAnalytics: async () => {
    // return await api.get('/analytics');
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockAnalyticsData }), 700));
  },

  getUsers: async () => {
    // return await api.get('/users');
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockUsers }), 500));
  },

  updateUserRole: async (userId, newRole) => {
    // return await api.post('/update-role', { userId, role: newRole });
    return new Promise((resolve) => {
      setTimeout(() => {
        setMockUsers((current) => current.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        resolve({ data: { message: "Role updated successfully", userId, newRole } });
      }, 500);
    });
  },

  toggleUserStatus: async (userId, status) => {
    // return await api.post('/suspend-user', { userId, status });
    return new Promise((resolve) => {
      setTimeout(() => {
        setMockUsers((current) => current.map((u) => (u.id === userId ? { ...u, status } : u)));
        resolve({ data: { message: `Account ${status.toLowerCase()} successfully`, userId, status } });
      }, 500);
    });
  },

  resetUserPassword: async (userId) => {
    // return await api.post('/reset-password', { userId });
    return new Promise((resolve) => {
      setTimeout(() => resolve({ data: { message: "Password reset link sent successfully", userId } }), 500);
    });
  },

  getRoles: async () => {
    // return await api.get('/roles');
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockRoles }), 600));
  },

  updateRolePermissions: async (roleId, permissions) => {
    // return await api.post('/update-role-permissions', { roleId, permissions });
    return new Promise((resolve) => {
      setTimeout(() => {
        setMockRoles((current) => current.map((r) =>
          r.id === roleId ? { ...r, permissions, lastUpdated: new Date().toISOString().split('T')[0] } : r
        ));
        resolve({ data: { message: "Role permissions updated successfully", roleId } });
      }, 600);
    });
  },

  getActivityLogs: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockActivityLogs }), 500));
  },

  getStorageStats: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockStorageStats }), 500));
  },

  getFiles: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockFiles }), 500));
  },

  deleteFile: async (fileId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMockFiles((current) => current.filter((f) => f.id !== fileId));
        resolve({ data: { message: "File deleted successfully", fileId } });
      }, 500);
    });
  },

  getAiUsageStats: async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: mockAiUsageStats }), 500));
  }
};
