const SUBMISSIONS_PREFIX = 'acadassist.teacher.onlineTestSubmissions.v1.';

export const getSubmissionsStorageKey = (examId) => `${SUBMISSIONS_PREFIX}${examId}`;

export const loadOnlineTestSubmissions = (examId) => {
  try {
    const raw = localStorage.getItem(getSubmissionsStorageKey(examId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveOnlineTestSubmissions = (examId, submissions) => {
  try {
    localStorage.setItem(getSubmissionsStorageKey(examId), JSON.stringify(submissions || []));
  } catch {
    // ignore
  }
};

export const upsertOnlineTestSubmission = (examId, submission) => {
  const safeExamId = String(examId || '');
  if (!safeExamId) return;

  const next = { ...(submission || {}) };
  if (!next.studentKey) return;

  const current = loadOnlineTestSubmissions(safeExamId);
  const index = current.findIndex((s) => s?.studentKey === next.studentKey);

  if (index >= 0) {
    const updated = [...current];
    updated[index] = { ...current[index], ...next };
    saveOnlineTestSubmissions(safeExamId, updated);
    return;
  }

  saveOnlineTestSubmissions(safeExamId, [next, ...current]);
};
