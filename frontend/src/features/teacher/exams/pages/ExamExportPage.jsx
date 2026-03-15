import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExportOptions } from '../components/ExportOptions';
import { useExportExam } from '../hooks/useExamGenerator';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamExportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId || 'exam-xyz123';
  
  const [exportSuccess, setExportSuccess] = useState(null);
  const exportMutation = useExportExam();

  const handleExport = async (format) => {
    try {
      const result = await exportMutation.mutateAsync({ examId, format });
      if (result.success) {
        setExportSuccess(format);
        // In a real app, you might trigger a file download using result.url
        // e.g., window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Export & Publish</h1>
          <p className="text-muted-foreground">Download your generated exam paper or publish it directly online.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Preview
          </Button>
          <Button variant="secondary" onClick={() => navigate('/teacher/dashboard')} className="gap-2">
            <Home className="w-4 h-4" /> Go to Dashboard
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
            <CardTitle>Choose Export Format</CardTitle>
            <CardDescription>
              Select how you want to distribute this exam to your students.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <ExportOptions 
              onExport={handleExport} 
              isExporting={exportMutation.isPending}
              exportSuccess={exportSuccess}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExamExportPage;
