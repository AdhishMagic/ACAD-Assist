import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExamPreview } from '../components/ExamPreview';
import { useExamPreview, usePolishExamWithAI } from '../hooks/useExamGenerator';
import { ArrowLeft, Download, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTE_PATHS } from '@/app/routes/routePaths';

const ExamPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId || 'exam-xyz123'; // fallback for demo
  const [aiInstruction, setAiInstruction] = useState('Improve wording, remove ambiguity, and make the paper teacher-ready.');
  
  const { data: examData, isLoading, isError, refetch } = useExamPreview(examId);
  const polishMutation = usePolishExamWithAI();

  const handleAiPolish = async () => {
    if (!examData) return;
    try {
      await polishMutation.mutateAsync({
        examId,
        exam: examData,
        instruction: aiInstruction,
      });
      await refetch();
    } catch (error) {
      console.error('AI edit failed', error);
    }
  };

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
        <Button onClick={() => navigate(ROUTE_PATHS.TEACHER_QUESTION_PAPER)}>Try Again</Button>
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
          <Button variant="outline" size="sm" onClick={() => navigate(ROUTE_PATHS.TEACHER_QUESTION_PAPER)} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
          <Button size="sm" onClick={() => navigate(ROUTE_PATHS.TEACHER_EXAM_EXPORT, { state: { examId } })} className="gap-2 shadow-md">
            <Download className="w-4 h-4" /> Continue to Export
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto mb-6 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-sm font-semibold">AI Edit Before PDF Export</h2>
              <p className="text-sm text-muted-foreground">Refine the saved draft with AI, then export the updated version as PDF.</p>
            </div>
            <textarea
              className="min-h-[96px] w-full rounded-lg border bg-background px-3 py-2 text-sm"
              value={aiInstruction}
              onChange={(event) => setAiInstruction(event.target.value)}
              placeholder="Tell AI what to improve in this paper"
            />
            <div className="flex justify-end">
              <Button onClick={handleAiPolish} disabled={polishMutation.isPending} className="gap-2">
                <Sparkles className="w-4 h-4" />
                {polishMutation.isPending ? 'Applying AI Edits...' : 'Apply AI Edits'}
              </Button>
            </div>
          </div>
        </div>
        <ExamPreview exam={examData} />
      </motion.div>
    </div>
  );
};

export default ExamPreviewPage;
