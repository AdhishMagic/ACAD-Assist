export const NOTES_ROUTES = {
  EXPLORER: '/student/notes',
  SUBJECT: (subjectId) => `/student/notes/${subjectId}`,
  VIEWER: (noteId) => `/student/notes/view/${noteId}`,
};
