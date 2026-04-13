import { ROUTE_PATHS } from '@/app/routes/routePaths';
import HODDashboard from '../pages/HODDashboard';
import DepartmentPerformancePage from '../pages/DepartmentPerformancePage';
import TeacherContributionsPage from '../pages/TeacherContributionsPage';
import CourseMaterialsApprovalPage from '../pages/CourseMaterialsApprovalPage';
import StudentEngagementPage from '../pages/StudentEngagementPage';
import ProjectApprovalsPage from '../pages/ProjectApprovalsPage';

export const hodRoutes = [
  { path: ROUTE_PATHS.HOD_DASHBOARD, element: <HODDashboard /> },
  { path: ROUTE_PATHS.HOD_PERFORMANCE, element: <DepartmentPerformancePage /> },
  { path: ROUTE_PATHS.HOD_TEACHER_CONTRIBUTIONS, element: <TeacherContributionsPage /> },
  { path: ROUTE_PATHS.HOD_MATERIAL_APPROVAL, element: <CourseMaterialsApprovalPage /> },
  { path: ROUTE_PATHS.HOD_STUDENT_ENGAGEMENT, element: <StudentEngagementPage /> },
  { path: ROUTE_PATHS.HOD_PROJECT_APPROVALS, element: <ProjectApprovalsPage /> },
];
