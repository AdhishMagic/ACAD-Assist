import HODDashboard from '../pages/HODDashboard';
import DepartmentAnalyticsPage from '../pages/DepartmentAnalyticsPage';
import CourseApprovalPage from '../pages/CourseApprovalPage';

export const hodRoutes = [
  { path: 'dashboard', element: <HODDashboard /> },
  { path: 'analytics', element: <DepartmentAnalyticsPage /> },
  { path: 'course-approval', element: <CourseApprovalPage /> }
];
