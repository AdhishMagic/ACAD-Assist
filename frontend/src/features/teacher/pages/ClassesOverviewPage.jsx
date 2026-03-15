import React from 'react';
import { useTeacherClasses } from '../hooks/useTeacherDashboard';
import ClassesTable from '../components/ClassesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ClassesOverviewPage = () => {
  const { classesData, isClassesLoading } = useTeacherClasses();

  if (isClassesLoading || !classesData) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Classes Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your active classes and tracked subjects.
          </p>
        </div>
        <div>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Class
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ClassesTable classes={classesData} />
      </motion.div>
    </div>
  );
};

export default ClassesOverviewPage;
