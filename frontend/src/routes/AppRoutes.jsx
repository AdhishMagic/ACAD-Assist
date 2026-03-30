import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout, AuthLayout } from "@/layouts";
import { ROUTE_PATHS } from "@/app/routes/routePaths";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { RoleBasedRedirect } from "./RoleBasedRedirect";
import NotFoundPage from "@/pages/NotFoundPage";

// Teacher Management System
import { teacherRoutes } from "@/features/teacher/constants/teacherRoutes";

// HOD System
import { hodRoutes } from "@/features/hod/constants/hodRoutes";


// Admin System
import { adminRoutes } from "@/features/admin/constants/adminRoutes.jsx";

const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
const RoleConfirmPage = lazy(() => import("@/features/auth/pages/RoleConfirmPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const StudentDashboard = lazy(() => import("@/features/student/pages/StudentDashboard"));
const StudyOverviewPage = lazy(() => import("@/features/student/pages/StudyOverviewPage"));
const StudyAnalyticsPage = lazy(() => import("@/features/student/pages/StudyAnalyticsPage"));
const ProjectSubmissionPage = lazy(() => import("@/features/student/pages/ProjectSubmissionPage"));
const OnlineTestPage = lazy(() => import("@/features/student/pages/OnlineTestPage"));
const OnlineTestLegacyRedirect = lazy(() => import("@/features/student/pages/OnlineTestLegacyRedirect"));
const KnowledgeRepoPage = lazy(() => import("@/pages/knowledge-repo/KnowledgeRepoPage"));
const DocumentDetailPage = lazy(() => import("@/pages/knowledge-repo/DocumentDetailPage"));
const GeneratorPage = lazy(() => import("@/pages/qpaper/GeneratorPage"));
const PaperPreviewPage = lazy(() => import("@/pages/qpaper/PaperPreviewPage"));
const NotificationsPage = lazy(() => import("@/features/system/pages/NotificationsPage"));
const ProfilePage = lazy(() => import("@/features/system/pages/ProfilePage"));
const FileUploadManagerPage = lazy(() =>
  import("@/features/system/pages/FileUploadManagerPage").then((module) => ({ default: module.FileUploadManagerPage }))
);
const FilePreviewPage = lazy(() =>
  import("@/features/system/pages/FilePreviewPage").then((module) => ({ default: module.FilePreviewPage }))
);
const ActivityFeedPage = lazy(() =>
  import("@/features/system/pages/ActivityFeedPage").then((module) => ({ default: module.ActivityFeedPage }))
);
const SystemDashboardPage = lazy(() => import("@/features/system/pages/SystemDashboardPage"));
const NotesExplorer = lazy(() => import("@/features/notes/pages/NotesExplorer"));
const SubjectNotesPage = lazy(() => import("@/features/notes/pages/SubjectNotesPage"));
const NotesViewer = lazy(() => import("@/features/notes/pages/NotesViewer"));
const AIChatPage = lazy(() => import("@/features/ai/pages/AIChatPage"));
const SavedNotesPage = lazy(() => import("@/features/ai/pages/SavedNotesPage"));
const GeneratedNotesPage = lazy(() => import("@/features/ai/pages/GeneratedNotesPage"));
const GeneratedNotesLibraryPage = lazy(() => import("@/features/ai/pages/GeneratedNotesLibraryPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage }))
);

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading...</div>}>
      <Routes>
      <Route path={ROUTE_PATHS.ROOT} element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path={ROUTE_PATHS.CHOOSE_ROLE} element={<RoleConfirmPage />} />
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Common Authenticated Routes */}
          <Route path={ROUTE_PATHS.DASHBOARD} element={<RoleBasedRedirect />} />
          <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
          <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTE_PATHS.FILE_MANAGER} element={<FileUploadManagerPage />} />
          <Route path={ROUTE_PATHS.FILE_PREVIEW} element={<FilePreviewPage />} />
          <Route path={ROUTE_PATHS.ACTIVITY_FEED} element={<ActivityFeedPage />} />

          {/* Published Online Test (all authenticated roles) */}
          <Route path="/online-test/:examId" element={<OnlineTestPage />} />
          {/* Legacy link support */}
          <Route path="/student/online-test/:examId" element={<OnlineTestLegacyRedirect />} />

          {/* System Routes */}
          <Route element={<RoleGuard allowedRoles={['system']} />}>
            <Route path={ROUTE_PATHS.SYSTEM_DASHBOARD} element={<SystemDashboardPage />} />
          </Route>

          {/* Student Routes */}
          <Route element={<RoleGuard allowedRoles={['student']} />}>
            <Route path="/student">
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="study-overview" element={<StudyOverviewPage />} />
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
              <Route path="ai/generated" element={<GeneratedNotesLibraryPage />} />
              <Route path="ai/generated/:noteId" element={<GeneratedNotesPage />} />
            </Route>
          </Route>

          {/* Teacher System Routes */}
          <Route element={<RoleGuard allowedRoles={['teacher']} />}>
            {teacherRoutes.map((route) => (
              <Route key={route.path} path={`/teacher/${route.path}`} element={route.element} />
            ))}
          </Route>

          {/* HOD System Routes */}
          <Route element={<RoleGuard allowedRoles={['hod']} />}>
            {hodRoutes.map((route) => (
              <Route key={route.path} path={`/hod/${route.path}`} element={route.element} />
            ))}

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
    </Suspense>
  );
}
