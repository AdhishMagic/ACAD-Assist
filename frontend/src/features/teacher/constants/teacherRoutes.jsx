import React from 'react';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import TeacherDashboard from '../pages/TeacherDashboard';
import ClassesOverviewPage from '../pages/ClassesOverviewPage';
import StudentActivityPage from '../pages/StudentActivityPage';
import NotesStudioPage from '../pages/NotesStudioPage';
import { examRoutes } from '../exams/constants/examRoutes';

export const teacherRoutes = [
  {
    path: ROUTE_PATHS.TEACHER_DASHBOARD,
    element: <TeacherDashboard />
  },
  {
    path: ROUTE_PATHS.TEACHER_CLASSES,
    element: <ClassesOverviewPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_ACTIVITY,
    element: <StudentActivityPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_NOTES_STUDIO,
    element: <NotesStudioPage />
  },
  ...examRoutes
];
