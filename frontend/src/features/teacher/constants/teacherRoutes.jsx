import React from 'react';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import TeacherDashboard from '../pages/TeacherDashboard';
import ClassesOverviewPage from '../pages/ClassesOverviewPage';
import StudentActivityPage from '../pages/StudentActivityPage';
import NotesStudio from '@/features/materials/NotesStudio';
import SavedNotes from '@/features/materials/SavedNotes';
import NotesExplorer from '@/features/notes/pages/NotesExplorer';
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
    element: <NotesStudio />
  },
  {
    path: ROUTE_PATHS.TEACHER_SAVED_NOTES,
    element: <SavedNotes />
  },
  {
    path: ROUTE_PATHS.TEACHER_EXPLORE_NOTES,
    element: <NotesExplorer />
  },
  ...examRoutes
];
