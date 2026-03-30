import { MOCK_TOKEN, MOCK_USER } from '@/shared/mocks/auth.mock';

const REGISTERED_USERS_KEY = 'mock_registered_users_v1';

const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setRegisteredUsers = (users) => {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users || {}));
  } catch {
    // ignore storage failures
  }
};

const title = (s) => {
  const safe = String(s || '').trim();
  if (!safe) return '';
  return safe.charAt(0).toUpperCase() + safe.slice(1);
};

const guessNameFromEmail = (email) => {
  const local = String(email || '').split('@')[0] || '';
  const parts = local.split(/[._-]+/).filter(Boolean).map(title);
  if (parts.length === 0) return { first_name: '', last_name: '' };
  if (parts.length === 1) return { first_name: parts[0], last_name: '' };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
};

// Simulates network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials) => {
    await delay(1000); // 1s simulation
    console.log('[MOCK API] Login attempt with:', credentials);

    const email = credentials?.email;
    const users = getRegisteredUsers();
    const existing = email ? users[email] : null;
    const guessed = guessNameFromEmail(email);

    // Simulate successful login (uses registered user if available, else derives a basic name from email)
    return {
      user: {
        ...MOCK_USER,
        ...(existing || {}),
        email,
        first_name: existing?.first_name ?? guessed.first_name ?? MOCK_USER.first_name,
        last_name: existing?.last_name ?? guessed.last_name ?? MOCK_USER.last_name,
      },
      access: MOCK_TOKEN,
      refresh: 'mock_refresh_token'
    };
  },
  
  register: async (userData) => {
    await delay(1200); // 1.2s simulation
    console.log('[MOCK API] Register attempt with:', userData);

    const user = {
      ...MOCK_USER,
      email: userData.email,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
    };

    // Persist a lightweight mock "user DB" so future logins can reflect name/email.
    const users = getRegisteredUsers();
    users[user.email] = user;
    setRegisteredUsers(users);

    // Simulate generic successful registration
    return {
      user,
      access: MOCK_TOKEN,
      refresh: 'mock_refresh_token'
    };
  },
  
  forgotPassword: async (emailData) => {
    await delay(800);
    console.log('[MOCK API] Forgot password request for:', emailData);
    return { message: 'Password reset email sent if the account exists.' };
  },
};
