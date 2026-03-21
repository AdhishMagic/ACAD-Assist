export const SYSTEM_ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  HOD: 'HOD',
  ADMIN: 'Admin',
  SYSTEM: 'System'
};

export const FILE_UPLOAD_CONFIG = {
  MAX_SIZE_MB: 10,
  ACCEPTED_TYPES: {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt', '.csv', '.md']
  }
};
