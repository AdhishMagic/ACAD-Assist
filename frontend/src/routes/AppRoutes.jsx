import { Routes, Route } from "react-router-dom";
import { DashboardLayout, AuthLayout, MainLayout } from "@/layouts";
import LandingPage from "@/features/landing/pages/LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { RoleBasedRedirect } from "./RoleBasedRedirect";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import StudentDashboard from "@/features/student/pages/StudentDashboard";
import StudyOverviewPage from "@/features/student/pages/StudyOverviewPage";
import StudyAnalyticsPage from "@/features/student/pages/StudyAnalyticsPage";
import ProjectSubmissionPage from "@/features/student/pages/ProjectSubmissionPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import LessonPage from "@/pages/courses/LessonPage";
import KnowledgeRepoPage from "@/pages/knowledge-repo/KnowledgeRepoPage";
import DocumentDetailPage from "@/pages/knowledge-repo/DocumentDetailPage";
import GeneratorPage from "@/pages/qpaper/GeneratorPage";
import PaperPreviewPage from "@/pages/qpaper/PaperPreviewPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

// System Utility Pages
import NotificationsPage from "@/features/system/pages/NotificationsPage";
import GlobalSearchPage from "@/features/system/pages/GlobalSearchPage";
import ProfilePage from "@/features/system/pages/ProfilePage";

// Notes System
import NotesExplorer from "@/features/notes/pages/NotesExplorer";
import SubjectNotesPage from "@/features/notes/pages/SubjectNotesPage";
import NotesViewer from "@/features/notes/pages/NotesViewer";

// AI Study System Pages
import AIChatPage from "@/features/ai/pages/AIChatPage";
import SavedNotesPage from "@/features/ai/pages/SavedNotesPage";
import GeneratedNotesPage from "@/features/ai/pages/GeneratedNotesPage";

// Teacher Management System
import { teacherRoutes } from "@/features/teacher/constants/teacherRoutes";

// HOD System
import { hodRoutes } from "@/features/hod/constants/hodRoutes";
import ProjectApprovalsPage from "@/features/hod/pages/ProjectApprovalsPage";

// Admin System
import { adminRoutes } from "@/features/admin/constants/adminRoutes.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Common Authenticated Routes */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<GlobalSearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Student Routes */}
          <Route element={<RoleGuard allowedRoles={['student', 'teacher', 'hod', 'admin']} />}>
            <Route path="/student">
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="study-overview" element={<StudyOverviewPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
              <Route path="knowledge" element={<KnowledgeRepoPage />} />
              <Route path="knowledge/:id" element={<DocumentDetailPage />} />
              <Route path="qpaper/generate" element={<GeneratorPage />} />
              <Route path="qpaper/:id" element={<PaperPreviewPage />} />
              <Route path="analytics" element={<StudyAnalyticsPage />} />
              <Route path="project-submission" element={<ProjectSubmissionPage />} />
            
              {/* Notes System Routes */}
              <Route path="notes" element={<NotesExplorer />} />
              <Route path="notes/view/:noteId" element={<NotesViewer />} />
              <Route path="notes/:subjectId" element={<SubjectNotesPage />} />

              {/* AI Study System Routes */}
              <Route path="ai" element={<AIChatPage />} />
              <Route path="ai/saved-notes" element={<SavedNotesPage />} />
              <Route path="ai/generated/:noteId" element={<GeneratedNotesPage />} />
            </Route>
          </Route>

          {/* Teacher System Routes */}
          <Route element={<RoleGuard allowedRoles={['teacher', 'hod', 'admin']} />}>
            {teacherRoutes.map((route) => (
              <Route key={route.path} path={`/teacher/${route.path}`} element={route.element} />
            ))}
          </Route>

          {/* HOD System Routes */}
          <Route element={<RoleGuard allowedRoles={['hod', 'admin']} />}>
            {hodRoutes.map((route) => (
              <Route key={route.path} path={`/hod/${route.path}`} element={route.element} />
            ))}
            <Route path="/hod/project-approvals" element={<ProjectApprovalsPage />} />
          </Route>

          {/* Admin System Routes */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            {adminRoutes.map((route) => (
              <Route key={route.path} path={`/admin/${route.path}`} element={route.element} />
            ))}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
