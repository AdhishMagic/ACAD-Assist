import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { Navigate } from 'react-router-dom';
import MaterialsUploadPage from '../pages/MaterialsUploadPage';
import JSONTemplateBuilderPage from '../pages/JSONTemplateBuilderPage';
import TemplatePreviewPage from '../pages/TemplatePreviewPage';
import QuestionGeneratorPage from '../pages/QuestionGeneratorPage';
import ExamPreviewPage from '../pages/ExamPreviewPage';
import ExamExportPage from '../pages/ExamExportPage';
import OnlineTestsPage from '../pages/OnlineTestsPage';
import OnlineTestResultsPage from '../pages/OnlineTestResultsPage';

export const examRoutes = [
  {
    path: ROUTE_PATHS.TEACHER_QUESTION_PAPER,
    element: <MaterialsUploadPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_MATERIALS_UPLOAD,
    element: <Navigate to={ROUTE_PATHS.TEACHER_QUESTION_PAPER} replace />
  },
  {
    path: ROUTE_PATHS.TEACHER_TEMPLATE_BUILDER,
    element: <JSONTemplateBuilderPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_TEMPLATE_PREVIEW,
    element: <TemplatePreviewPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_QUESTION_GENERATOR,
    element: <QuestionGeneratorPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_EXAM_PREVIEW,
    element: <ExamPreviewPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_EXAM_EXPORT,
    element: <ExamExportPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_ONLINE_TESTS,
    element: <OnlineTestsPage />
  },
  {
    path: ROUTE_PATHS.TEACHER_ONLINE_TEST_RESULTS,
    element: <OnlineTestResultsPage />
  }
];
