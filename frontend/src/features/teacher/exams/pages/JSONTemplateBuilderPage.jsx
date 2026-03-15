import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateSectionBuilder } from '../components/TemplateSectionBuilder';
import { JSONEditor } from '../components/JSONEditor';
import { useSaveTemplate } from '../hooks/useExamGenerator';
import { motion } from 'framer-motion';
import { Save, ArrowRight, Settings, Code } from 'lucide-react';

const initialTemplate = {
  examTitle: "Mid-Term Examination",
  duration: 90,
  sections: [
    {
      id: "1",
      name: "Section A: Multiple Choice",
      questionType: "MCQ",
      questionCount: 10,
      marksPerQuestion: 1,
      difficulty: "Medium"
    },
    {
      id: "2",
      name: "Section B: Short Answer",
      questionType: "Short Answer",
      questionCount: 5,
      marksPerQuestion: 3,
      difficulty: "Medium"
    }
  ]
};

const JSONTemplateBuilderPage = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState(initialTemplate);
  const saveMutation = useSaveTemplate();

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync(template);
      navigate('/teacher/template-preview');
    } catch (error) {
      console.error('Failed to save template', error);
    }
  };

  const handleSectionsChange = (newSections) => {
    setTemplate(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Template Builder</h1>
          <p className="text-muted-foreground">Define the structure, sections, and marking scheme for your exam.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/teacher/materials-upload')}>
            Back
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2 shadow-md">
            {saveMutation.isPending ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Save & Preview
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border shadow-md overflow-hidden">
          <Tabs defaultValue="visual" className="w-full">
            <CardHeader className="bg-muted/20 border-b pb-0 pt-4 px-6 flex flex-row justify-between items-end">
              <div className="mb-4">
                <CardTitle className="text-xl">Exam Structure</CardTitle>
              </div>
              <TabsList className="mb-0 rounded-none rounded-t-lg bg-transparent border-b-0 space-x-2">
                <TabsTrigger value="visual" className="data-[state=active]:bg-background data-[state=active]:border-x data-[state=active]:border-t rounded-t-lg border-b-transparent px-6 py-2 gap-2 text-sm">
                  <Settings className="w-4 h-4" /> Visual Builder
                </TabsTrigger>
                <TabsTrigger value="json" className="data-[state=active]:bg-background data-[state=active]:border-x data-[state=active]:border-t rounded-t-lg border-b-transparent px-6 py-2 gap-2 text-sm">
                  <Code className="w-4 h-4" /> JSON Editor
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="visual" className="m-0 p-6">
                <TemplateSectionBuilder 
                  sections={template.sections} 
                  onChange={handleSectionsChange} 
                />
              </TabsContent>
              <TabsContent value="json" className="m-0 p-0 h-[600px]">
                <JSONEditor 
                  initialValue={template}
                  onChange={(parsedJson) => setTemplate(parsedJson)}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default JSONTemplateBuilderPage;
