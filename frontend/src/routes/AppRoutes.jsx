import { Routes, Route } from "react-router-dom";
import { DashboardLayout, AuthLayout, MainLayout } from "@/layouts";
import LandingPage from "@/features/landing/pages/LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import StudentDashboard from "@/features/student/pages/StudentDashboard";
import StudyOverviewPage from "@/features/student/pages/StudyOverviewPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import LessonPage from "@/pages/courses/LessonPage";
import AiAssistantPage from "@/pages/ai-assistant/AiAssistantPage";
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
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/study-overview" element={<StudyOverviewPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/knowledge" element={<KnowledgeRepoPage />} />
          <Route path="/knowledge/:id" element={<DocumentDetailPage />} />
          <Route path="/qpaper/generate" element={<GeneratorPage />} />
          <Route path="/qpaper/:id" element={<PaperPreviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          
          {/* Notes System Routes */}
          <Route path="/notes" element={<NotesExplorer />} />
          <Route path="/notes/view/:noteId" element={<NotesViewer />} />
          <Route path="/notes/:subjectId" element={<SubjectNotesPage />} />

          {/* System Utility Routes */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<GlobalSearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
