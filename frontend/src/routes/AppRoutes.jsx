import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts";
import LandingPage from "@/features/landing/pages/LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import LessonPage from "@/pages/courses/LessonPage";
import AiAssistantPage from "@/pages/ai-assistant/AiAssistantPage";
import KnowledgeRepoPage from "@/pages/knowledge-repo/KnowledgeRepoPage";
import DocumentDetailPage from "@/pages/knowledge-repo/DocumentDetailPage";
import GeneratorPage from "@/pages/qpaper/GeneratorPage";
import PaperPreviewPage from "@/pages/qpaper/PaperPreviewPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/knowledge" element={<KnowledgeRepoPage />} />
          <Route path="/knowledge/:id" element={<DocumentDetailPage />} />
          <Route path="/qpaper/generate" element={<GeneratorPage />} />
          <Route path="/qpaper/:id" element={<PaperPreviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
