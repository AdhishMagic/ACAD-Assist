import axios from "axios";

// Mock Data for Admin Dashboard Stats
const mockDashboardData = {
  totalUsers: 1250,
  activeStudents: 850,
  activeTeachers: 120,
  hods: 15,
  aiRequestsToday: 4230,
  storageUsed: "1.2 TB",
  recentActivity: [
    { id: 1, type: "user_registered", message: "New user John Doe registered as Student", time: "10 mins ago" },
    { id: 2, type: "notes_uploaded", message: "Dr. Smith uploaded 'Quantum Mechanics Part 2'", time: "1 hour ago" },
    { id: 3, type: "ai_spike", message: "High AI study assistant usage detected", time: "3 hours ago" },
    { id: 4, type: "user_suspended", message: "User account max_m suspended", time: "5 hours ago" },
  ]
};

// Mock Data for System Analytics
const mockAnalyticsData = {
  userGrowth: [
    { date: "Mon", users: 150 },
    { date: "Tue", users: 230 },
    { date: "Wed", users: 280 },
    { date: "Thu", users: 310 },
    { date: "Fri", users: 380 },
    { date: "Sat", users: 420 },
    { date: "Sun", users: 500 },
  ],
  systemUsage: [
    { date: "00:00", aiQueries: 100, uploads: 20, activeSessions: 50 },
    { date: "04:00", aiQueries: 50, uploads: 5, activeSessions: 20 },
    { date: "08:00", aiQueries: 400, uploads: 80, activeSessions: 300 },
    { date: "12:00", aiQueries: 800, uploads: 150, activeSessions: 700 },
    { date: "16:00", aiQueries: 600, uploads: 120, activeSessions: 550 },
    { date: "20:00", aiQueries: 950, uploads: 200, activeSessions: 850 },
  ],
  metrics: {
    dailyActiveUsers: 856,
    avgSessionLength: "45m",
    totalUploadsMonthly: 12500,
    platformUptime: "99.9%"
  }
};

// Mock Data for Users
let mockUsers = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "Student", status: "Active", joinDate: "2026-01-15", lastLogin: "Today" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", role: "Teacher", status: "Active", joinDate: "2025-11-20", lastLogin: "Yesterday" },
  { id: "u3", name: "Charlie Davis", email: "charlie@example.com", role: "HOD", status: "Active", joinDate: "2025-08-05", lastLogin: "2 days ago" },
  { id: "u4", name: "Diana Prince", email: "diana@example.com", role: "Student", status: "Suspended", joinDate: "2026-02-10", lastLogin: "1 week ago" },
  { id: "u5", name: "Evan Wright", email: "evan@example.com", role: "Admin", status: "Active", joinDate: "2024-03-12", lastLogin: "Today" },
  { id: "u6", name: "Fiona Gallagher", email: "fiona@example.com", role: "Student", status: "Active", joinDate: "2026-03-01", lastLogin: "Today" },
  { id: "u7", name: "George Miller", email: "george@example.com", role: "Teacher", status: "Active", joinDate: "2025-09-18", lastLogin: "3 days ago" },
];

// Mock Data for Roles
let mockRoles = [
  {
    id: "r1",
    name: "Admin",
    userCount: 15,
    lastUpdated: "2026-03-10",
    permissions: ["access_dashboard", "access_notes", "access_ai", "access_teacher_panel", "access_hod_panel", "access_admin_panel"]
  },
  {
    id: "r2",
    name: "HOD",
    userCount: 45,
    lastUpdated: "2026-02-15",
    permissions: ["access_dashboard", "access_notes", "access_ai", "access_teacher_panel", "access_hod_panel"]
  },
  {
    id: "r3",
    name: "Teacher",
    userCount: 320,
    lastUpdated: "2026-01-20",
    permissions: ["access_dashboard", "access_notes", "access_ai", "access_teacher_panel"]
  },
  {
    id: "r4",
    name: "Student",
    userCount: 8500,
    lastUpdated: "2025-12-05",
    permissions: ["access_dashboard", "access_notes", "access_ai"]
  }
];

const api = axios.create({
  baseURL: "/api/admin",
});

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
        mockUsers = mockUsers.map((u) => u.id === userId ? { ...u, role: newRole } : u);
        resolve({ data: { message: "Role updated successfully", userId, newRole } });
      }, 500);
    });
  },

  toggleUserStatus: async (userId, status) => {
    // return await api.post('/suspend-user', { userId, status });
    return new Promise((resolve) => {
      setTimeout(() => {
        mockUsers = mockUsers.map((u) => u.id === userId ? { ...u, status } : u);
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
        mockRoles = mockRoles.map((r) => 
          r.id === roleId ? { ...r, permissions, lastUpdated: new Date().toISOString().split('T')[0] } : r
        );
        resolve({ data: { message: "Role permissions updated successfully", roleId } });
      }, 600);
    });
  }
};
