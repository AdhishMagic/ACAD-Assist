import { lazy } from "react";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const SystemAnalyticsPage = lazy(() => import("../pages/SystemAnalyticsPage"));
const UserManagementPage = lazy(() => import("../pages/UserManagementPage"));
const RoleManagementPage = lazy(() => import("../pages/RoleManagementPage"));

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
];
