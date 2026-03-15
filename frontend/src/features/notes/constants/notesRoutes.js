export const NOTES_ROUTES = {
  EXPLORER: '/notes',
  SUBJECT: (subjectId) => `/notes/${subjectId}`,
  VIEWER: (noteId) => `/notes/view/${noteId}`,
};
