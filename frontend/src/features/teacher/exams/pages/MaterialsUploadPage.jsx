import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UploadPanel from '../../components/UploadPanel';
import { useExamDrafts, useExamTemplates, useGenerateExam, useSaveTemplate } from '../hooks/useExamGenerator';
import { QuestionGeneratorForm } from '../components/QuestionGeneratorForm';
import { loadTemplateDraft, saveTemplateDraft } from '../utils/templateStorage';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { ArrowRight, CheckCircle2, FileJson2, Upload as UploadIcon } from 'lucide-react';

const MaterialsUploadPage = () => {
  const navigate = useNavigate();
  const generateMutation = useGenerateExam();
  const saveTemplateMutation = useSaveTemplate();
  const templatesQuery = useExamTemplates();
  const draftsQuery = useExamDrafts({ status: 'draft' });
  const templateDraft = loadTemplateDraft();
  const hasTemplateSections = Array.isArray(templateDraft?.sections) && templateDraft.sections.length > 0;

  const handleUploadComplete = async (files) => {
    try {
      await Promise.resolve(files);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const handleUploadSuccess = async ({ result }) => {
    handleUploadComplete([result]);
    if (result?.templateSuggestion) {
      saveTemplateDraft(result.templateSuggestion);
      try {
        await saveTemplateMutation.mutateAsync(result.templateSuggestion);
        await templatesQuery.refetch();
      } catch (error) {
        console.error('Failed to save extracted template', error);
      }
    }
  };

  const handleGenerate = async (config) => {
    try {
      const result = await generateMutation.mutateAsync(config);
      navigate(ROUTE_PATHS.TEACHER_EXAM_PREVIEW, {
        state: { examId: result.examId || result.exam_id || 'exam-xyz123' },
      });
    } catch (error) {
      console.error('Generation failed', error);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Question Paper Generator</h1>
        <p className="text-muted-foreground">Upload materials, review the exam template, and generate a PostgreSQL-backed draft from one flow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Saved Templates</p>
            <p className="mt-2 text-2xl font-semibold">{templatesQuery.data?.length ?? 0}</p>
            <p className="mt-1 text-sm text-muted-foreground">Templates already stored in the backend.</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Draft Papers</p>
            <p className="mt-2 text-2xl font-semibold">{draftsQuery.data?.length ?? 0}</p>
            <p className="mt-1 text-sm text-muted-foreground">Saved drafts you can continue refining.</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm bg-muted/20">
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Generation Mode</p>
            <p className="mt-2 text-lg font-semibold">Scaffold Only</p>
            <p className="mt-1 text-sm text-muted-foreground">The backend saves request/response contracts now; AI generation can plug in later.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <UploadIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Step 1</p>
              <p className="text-sm text-muted-foreground">Upload source notes and question references.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FileJson2 className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold">Step 2</p>
                <p className="text-sm text-muted-foreground">Define sections, marks, and template structure.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate(ROUTE_PATHS.TEACHER_TEMPLATE_BUILDER)}>
                {hasTemplateSections ? 'Edit Template' : 'Build Template'}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="flex items-start gap-3 p-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold">Step 3</p>
                <p className="text-sm text-muted-foreground">Generate the final question paper using the selected inputs.</p>
              </div>
              {hasTemplateSections ? (
                <Button variant="ghost" size="sm" className="px-0" onClick={() => navigate(ROUTE_PATHS.TEACHER_TEMPLATE_PREVIEW)}>
                  Preview Template <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-md">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Step 1: Upload Source Materials</CardTitle>
          <CardDescription>
            We'll extract key concepts, definitions, and topics to generate relevant questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <UploadPanel onUploadSuccess={handleUploadSuccess} />
        </CardContent>
      </Card>

      <QuestionGeneratorForm
        onGenerate={handleGenerate}
        isGenerating={generateMutation.isPending}
        templates={templatesQuery.data || []}
        templateSummary={
          hasTemplateSections
            ? `${templateDraft.sections.length} section${templateDraft.sections.length === 1 ? '' : 's'} configured`
            : 'No template configured yet'
        }
      />
    </div>
  );
};

export default MaterialsUploadPage;
