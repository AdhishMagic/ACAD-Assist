import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProjectSubmissionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submission logic
    console.log("Submitted:", { title, description });
    alert("Project submitted successfully to HOD.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Submission</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload and submit your final projects for HOD approval.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              placeholder="Enter your project title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <textarea 
              id="description" 
              className="w-full flex min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your project methodology and outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Project Files</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX, ZIP up to 50MB</p>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit for Review
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectSubmissionPage;
