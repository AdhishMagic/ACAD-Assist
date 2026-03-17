import HODDashboard from '../pages/HODDashboard';
import DepartmentPerformancePage from '../pages/DepartmentPerformancePage';
import TeacherContributionsPage from '../pages/TeacherContributionsPage';
import CourseMaterialsApprovalPage from '../pages/CourseMaterialsApprovalPage';
import StudentEngagementPage from '../pages/StudentEngagementPage';
import ProjectApprovalsPage from '../pages/ProjectApprovalsPage';

export const hodRoutes = [
  { path: 'dashboard', element: <HODDashboard /> },
  { path: 'performance', element: <DepartmentPerformancePage /> },
  { path: 'teacher-contributions', element: <TeacherContributionsPage /> },
  { path: 'material-approval', element: <CourseMaterialsApprovalPage /> },
  { path: 'student-engagement', element: <StudentEngagementPage /> },
  { path: 'project-approvals', element: <ProjectApprovalsPage /> },
];
