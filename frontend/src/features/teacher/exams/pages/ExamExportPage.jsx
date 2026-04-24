import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExportOptions } from '../components/ExportOptions';
import { useExportExam } from '../hooks/useExamGenerator';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTE_PATHS, buildPath } from '@/app/routes/routePaths';

const ExamExportPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId || 'exam-xyz123';
  
  const [exportSuccess, setExportSuccess] = useState(null);
  const [exportArtifacts, setExportArtifacts] = useState({});
  const exportMutation = useExportExam();

  const objectUrls = useMemo(() => {
    return Object.values(exportArtifacts)
      .map((a) => a?.objectUrl)
      .filter(Boolean);
  }, [exportArtifacts]);

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
    };
  }, [objectUrls]);

  const triggerDownload = ({ blob, filename }) => {
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return objectUrl;
  };

  const handleExport = async (format) => {
    try {
      const result = await exportMutation.mutateAsync({ examId, format });
      if (result.success) {
        setExportSuccess(format);

        if (format === 'online' && result.publishedUrl) {
          setExportArtifacts((prev) => ({
            ...prev,
            online: { publishedUrl: result.publishedUrl },
          }));

          try {
            await navigator.clipboard.writeText(result.publishedUrl);
          } catch {
            // ignore clipboard errors
          }
          return;
        }

        if (result.blob && result.filename) {
          const objectUrl = triggerDownload({ blob: result.blob, filename: result.filename });
          setExportArtifacts((prev) => {
            const prevUrl = prev?.[format]?.objectUrl;
            if (prevUrl && prevUrl !== objectUrl) {
              try {
                URL.revokeObjectURL(prevUrl);
              } catch {
                // ignore
              }
            }
            return {
              ...prev,
              [format]: {
                objectUrl,
                filename: result.filename,
                mimeType: result.mimeType,
              },
            };
          });
        }
      }
    } catch (error) {
      console.error('Export failed', error);
    }
  };

  const handleOpen = async (format) => {
    const artifact = exportArtifacts?.[format];
    if (!artifact) return;

    if (format === 'online' && artifact.publishedUrl) {
      try {
        await navigator.clipboard.writeText(artifact.publishedUrl);
      } catch {
        // ignore
      }
      window.open(artifact.publishedUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (artifact.objectUrl) {
      window.open(artifact.objectUrl, '_blank', 'noopener,noreferrer');
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
          <Button variant="outline" onClick={() => navigate(buildPath.teacherOnlineTestResults(examId))}>
            View Results
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTE_PATHS.TEACHER_DASHBOARD)} className="gap-2">
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
              onOpen={handleOpen}
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
