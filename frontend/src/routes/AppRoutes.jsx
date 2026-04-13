import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/routePaths";
import { AuthLayout, DashboardLayout } from "@/layouts";
import NotFoundPage from "@/pages/NotFoundPage";
import { adminRoutes } from "@/features/admin/constants/adminRoutes";
import { hodRoutes } from "@/features/hod/constants/hodRoutes";
import { teacherRoutes } from "@/features/teacher/constants/teacherRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRedirect } from "./RoleBasedRedirect";
import { RoleGuard } from "./RoleGuard";

const LandingPage = lazy(() => import("@/features/landing/pages/LandingPage"));
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
const RegisterPage = lazy(() =>
  import("@/features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage }))
);

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading...</div>}>
      <Routes>
        <Route path={ROUTE_PATHS.ROOT} element={<LandingPage />} />

        <Route element={<AuthLayout />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<RoleBasedRedirect />} />
            <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTE_PATHS.FILE_MANAGER} element={<FileUploadManagerPage />} />
            <Route path={ROUTE_PATHS.FILE_PREVIEW} element={<FilePreviewPage />} />
            <Route path={ROUTE_PATHS.ACTIVITY_FEED} element={<ActivityFeedPage />} />
            <Route path={ROUTE_PATHS.ONLINE_TEST} element={<OnlineTestPage />} />
            <Route path={ROUTE_PATHS.STUDENT_ONLINE_TEST_LEGACY} element={<OnlineTestLegacyRedirect />} />

            <Route element={<RoleGuard allowedRoles={["system"]} />}>
              <Route path={ROUTE_PATHS.SYSTEM_DASHBOARD} element={<SystemDashboardPage />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={["student"]} />}>
              <Route path={ROUTE_PATHS.STUDENT_DASHBOARD} element={<StudentDashboard />} />
              <Route path={ROUTE_PATHS.STUDENT_STUDY_OVERVIEW} element={<StudyOverviewPage />} />
              <Route path={ROUTE_PATHS.STUDENT_KNOWLEDGE} element={<KnowledgeRepoPage />} />
              <Route path={ROUTE_PATHS.STUDENT_KNOWLEDGE_DETAIL} element={<DocumentDetailPage />} />
              <Route path={ROUTE_PATHS.STUDENT_QPAPER_GENERATE} element={<GeneratorPage />} />
              <Route path={ROUTE_PATHS.STUDENT_QPAPER_DETAIL} element={<PaperPreviewPage />} />
              <Route path={ROUTE_PATHS.STUDENT_ANALYTICS} element={<StudyAnalyticsPage />} />
              <Route path={ROUTE_PATHS.STUDENT_PROJECT_SUBMISSION} element={<ProjectSubmissionPage />} />
              <Route path={ROUTE_PATHS.STUDENT_NOTES} element={<NotesExplorer />} />
              <Route path={ROUTE_PATHS.STUDENT_NOTES_VIEW} element={<NotesViewer />} />
              <Route path={ROUTE_PATHS.STUDENT_NOTES_SUBJECT} element={<SubjectNotesPage />} />
              <Route path={ROUTE_PATHS.STUDENT_AI} element={<AIChatPage />} />
              <Route path={ROUTE_PATHS.STUDENT_AI_SAVED_NOTES} element={<SavedNotesPage />} />
              <Route path={ROUTE_PATHS.STUDENT_AI_GENERATED} element={<GeneratedNotesLibraryPage />} />
              <Route path={ROUTE_PATHS.STUDENT_AI_GENERATED_NOTE} element={<GeneratedNotesPage />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={["teacher", "hod"]} />}>
              {teacherRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            <Route element={<RoleGuard allowedRoles={["hod"]} />}>
              {hodRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>

            <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              {adminRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
