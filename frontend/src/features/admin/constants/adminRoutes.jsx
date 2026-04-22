import { lazy } from "react";
import { ROUTE_PATHS } from "@/app/routes/routePaths";
import StudyAnalyticsPage from "@/features/student/pages/StudyAnalyticsPage";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const SystemAnalyticsPage = lazy(() => import("../pages/SystemAnalyticsPage"));
const UserManagementPage = lazy(() => import("../pages/UserManagementPage"));
const ActivityLogsPage = lazy(() => import("../pages/ActivityLogsPage"));
const StorageManagementPage = lazy(() => import("../pages/StorageManagementPage"));
const AIUsageAnalyticsPage = lazy(() => import("../pages/AIUsageAnalyticsPage"));

export const adminRoutes = [
  {
    path: ROUTE_PATHS.ADMIN_DASHBOARD,
    element: <AdminDashboard />,
  },
  {
    path: ROUTE_PATHS.ADMIN_ANALYTICS,
    element: <SystemAnalyticsPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_USERS,
    element: <UserManagementPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_ACTIVITY_LOGS,
    element: <ActivityLogsPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_STORAGE,
    element: <StorageManagementPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_AI_USAGE,
    element: <AIUsageAnalyticsPage />,
  },
  {
    path: ROUTE_PATHS.ADMIN_STUDENT_ANALYTICS,
    element: <StudyAnalyticsPage />,
  },
];
