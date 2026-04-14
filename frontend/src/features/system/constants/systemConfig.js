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
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/zip': ['.zip'],
  }
};
