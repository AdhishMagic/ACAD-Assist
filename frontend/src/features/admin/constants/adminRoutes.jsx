import { lazy } from "react";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const SystemAnalyticsPage = lazy(() => import("../pages/SystemAnalyticsPage"));
const UserManagementPage = lazy(() => import("../pages/UserManagementPage"));
const RoleManagementPage = lazy(() => import("../pages/RoleManagementPage"));
const ActivityLogsPage = lazy(() => import("../pages/ActivityLogsPage"));
const StorageManagementPage = lazy(() => import("../pages/StorageManagementPage"));
const AIUsageAnalyticsPage = lazy(() => import("../pages/AIUsageAnalyticsPage"));

export const adminRoutes = [
  {
    path: "dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "analytics",
    element: <SystemAnalyticsPage />,
  },
  {
    path: "users",
    element: <UserManagementPage />,
  },
  {
    path: "roles",
    element: <RoleManagementPage />,
  },
  {
    path: "activity-logs",
    element: <ActivityLogsPage />,
  },
  {
    path: "storage",
    element: <StorageManagementPage />,
  },
  {
    path: "ai-usage",
    element: <AIUsageAnalyticsPage />,
  },
];
