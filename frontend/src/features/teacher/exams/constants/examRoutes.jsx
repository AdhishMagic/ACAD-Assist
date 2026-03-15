// examRoutes.js
import MaterialsUploadPage from '../pages/MaterialsUploadPage';
import JSONTemplateBuilderPage from '../pages/JSONTemplateBuilderPage';
import TemplatePreviewPage from '../pages/TemplatePreviewPage';
import QuestionGeneratorPage from '../pages/QuestionGeneratorPage';
import ExamPreviewPage from '../pages/ExamPreviewPage';
import ExamExportPage from '../pages/ExamExportPage';

export const examRoutes = [
  {
    path: 'materials-upload',
    element: <MaterialsUploadPage />
  },
  {
    path: 'template-builder',
    element: <JSONTemplateBuilderPage />
  },
  {
    path: 'template-preview',
    element: <TemplatePreviewPage />
  },
  {
    path: 'question-generator',
    element: <QuestionGeneratorPage />
  },
  {
    path: 'exam-preview',
    element: <ExamPreviewPage />
  },
  {
    path: 'exam-export',
    element: <ExamExportPage />
  }
];
