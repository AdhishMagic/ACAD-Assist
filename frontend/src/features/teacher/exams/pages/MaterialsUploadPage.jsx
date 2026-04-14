import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import UploadPanel from '../../components/UploadPanel';
import { useUploadMaterial } from '../hooks/useExamGenerator';

const MaterialsUploadPage = () => {
  const navigate = useNavigate();
  const uploadMutation = useUploadMaterial();

  const handleUploadComplete = async (files) => {
    try {
      // In a real app, you'd create FormData and upload
      // const formData = new FormData();
      // files.forEach(f => formData.append('files', f));
      // await uploadMutation.mutateAsync(formData);
      
      // Since it's mock, we'll just wait a bit and navigate
      setTimeout(() => {
        navigate('/teacher/template-builder');
      }, 500);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const handleUploadSuccess = ({ file }) => {
    handleUploadComplete([file]);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Exam Generation System</h1>
        <p className="text-muted-foreground">Upload your course materials, notes, or previous question papers to provide context for the AI.</p>
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
    </div>
  );
};

export default MaterialsUploadPage;
