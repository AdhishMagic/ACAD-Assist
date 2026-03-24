import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExamPreview } from '../components/ExamPreview';
import { useExamPreview } from '../hooks/useExamGenerator';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId || 'exam-xyz123'; // fallback for demo
  
  const { data: examData, isLoading, isError } = useExamPreview(examId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Fetching generated exam...</p>
      </div>
    );
  }

  if (isError || !examData) {
    return (
      <div className="container mx-auto py-24 text-center">
        <p className="text-destructive mb-4">Failed to load the generated exam.</p>
        <Button onClick={() => navigate('/teacher/question-generator')}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background z-30 py-4 border-b shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Exam Paper Preview</h1>
          <p className="text-sm text-muted-foreground">Review the AI-generated questions carefully.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/teacher/question-generator')} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
          <Button size="sm" onClick={() => navigate('/teacher/exam-export', { state: { examId } })} className="gap-2 shadow-md">
            <Download className="w-4 h-4" /> Continue to Export
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ExamPreview exam={examData} />
      </motion.div>
    </div>
  );
};

export default ExamPreviewPage;
