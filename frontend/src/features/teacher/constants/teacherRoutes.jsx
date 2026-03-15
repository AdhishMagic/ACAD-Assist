import React from 'react';
import TeacherDashboard from '../pages/TeacherDashboard';
import ClassesOverviewPage from '../pages/ClassesOverviewPage';
import StudentActivityPage from '../pages/StudentActivityPage';
import NotesStudioPage from '../pages/NotesStudioPage';

export const teacherRoutes = [
  {
    path: 'dashboard',
    element: <TeacherDashboard />
  },
  {
    path: 'classes',
    element: <ClassesOverviewPage />
  },
  {
    path: 'activity',
    element: <StudentActivityPage />
  },
  {
    path: 'notes-studio',
    element: <NotesStudioPage />
  }
];
