const notImplemented = () => {
  throw new Error('Admin API endpoints not implemented. Please configure backend endpoints.');
};

export const adminAPI = {
  getDashboardStats: notImplemented,
  getSystemAnalytics: notImplemented,
  getUsers: notImplemented,
  updateUserRole: notImplemented,
  toggleUserStatus: notImplemented,
  resetUserPassword: notImplemented,
  getRoles: notImplemented,
  updateRolePermissions: notImplemented,
  getActivityLogs: notImplemented,
  getStorageStats: notImplemented,
  getFiles: notImplemented,
  deleteFile: notImplemented,
  getAiUsageStats: notImplemented,
};
