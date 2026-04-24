import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TemplatePreview } from '../components/TemplatePreview';
import { motion } from 'framer-motion';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { loadTemplateDraft } from '../utils/templateStorage';
import { ROUTE_PATHS } from '@/app/routes/routePaths';

const TemplatePreviewPage = () => {
  const navigate = useNavigate();
  const [template] = useState(() => {
    const draft = loadTemplateDraft();
    return (
      draft ?? {
        examTitle: 'Mid-Term Examination',
        sections: [],
      }
    );
  });

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Template Summary</h1>
          <p className="text-muted-foreground">Review your exam structure before generating questions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.TEACHER_TEMPLATE_BUILDER)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Edit Template
          </Button>
          <Button onClick={() => navigate(ROUTE_PATHS.TEACHER_QUESTION_PAPER)} className="gap-2 shadow-md bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
            <BrainCircuit className="w-4 h-4" /> Continue to Generation
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border shadow-md">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle>Final Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <TemplatePreview template={template} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TemplatePreviewPage;
