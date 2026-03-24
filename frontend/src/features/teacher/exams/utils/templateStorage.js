const STORAGE_KEY = 'acadassist.teacher.examTemplateDraft.v1';

export const saveTemplateDraft = (template) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
  } catch {
    // ignore storage errors (private mode, quota, etc)
  }
};

export const loadTemplateDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearTemplateDraft = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const TEMPLATE_DRAFT_STORAGE_KEY = STORAGE_KEY;
