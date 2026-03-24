import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionGeneratorForm } from '../components/QuestionGeneratorForm';
import { useGenerateExam } from '../hooks/useExamGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const QuestionGeneratorPage = () => {
  const navigate = useNavigate();
  const generateMutation = useGenerateExam();

  const handleGenerate = async (config) => {
    try {
      // In a real app, this would return an examId or save it to Redux
      const result = await generateMutation.mutateAsync(config);
      // Navigate to the preview page, passing the examId via state or URL
      navigate('/teacher/exam-preview', { state: { examId: result.examId || 'exam-xyz123' } });
    } catch (error) {
      console.error('Generation failed', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Generation Engine</h1>
          <p className="text-muted-foreground">Configure the final parameters before the AI crafts the exam questions.</p>
        </div>
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/teacher/template-preview')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <QuestionGeneratorForm 
          onGenerate={handleGenerate} 
          isGenerating={generateMutation.isPending} 
        />
      </div>
    </div>
  );
};

export default QuestionGeneratorPage;
