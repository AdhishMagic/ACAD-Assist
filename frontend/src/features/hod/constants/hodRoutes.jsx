import { ROUTE_PATHS } from '@/app/routes/routePaths';
import HODDashboard from '../pages/HODDashboard';
import DepartmentPerformancePage from '../pages/DepartmentPerformancePage';
import TeacherContributionsPage from '../pages/TeacherContributionsPage';
import CourseMaterialsApprovalPage from '../pages/CourseMaterialsApprovalPage';
import ProjectApprovalsPage from '../pages/ProjectApprovalsPage';
import StudyAnalyticsPage from '@/features/student/pages/StudyAnalyticsPage';
import { examRoutes } from '@/features/teacher/exams/constants/examRoutes';

export const hodRoutes = [
  { path: ROUTE_PATHS.HOD_DASHBOARD, element: <HODDashboard /> },
  { path: ROUTE_PATHS.HOD_PERFORMANCE, element: <DepartmentPerformancePage /> },
  { path: ROUTE_PATHS.HOD_TEACHER_CONTRIBUTIONS, element: <TeacherContributionsPage /> },
  { path: ROUTE_PATHS.HOD_MATERIAL_APPROVAL, element: <CourseMaterialsApprovalPage /> },
  { path: ROUTE_PATHS.HOD_PROJECT_APPROVALS, element: <ProjectApprovalsPage /> },
  { path: ROUTE_PATHS.HOD_STUDENT_ANALYTICS, element: <StudyAnalyticsPage /> },
  ...examRoutes,
];
