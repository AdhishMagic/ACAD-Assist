import React, { useMemo, useState } from 'react';
import { useTeacherClasses } from '../hooks/useTeacherDashboard';
import ClassesTable from '../components/ClassesTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import AddClassDialog from '../components/AddClassDialog';
import ClassDetailsDialog from '../components/ClassDetailsDialog';

const ClassesOverviewPage = () => {
  const { classesData, isClassesLoading, classesError } = useTeacherClasses();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const classesList = useMemo(() => (Array.isArray(classesData) ? classesData : []), [classesData]);

  const handleAddClass = (payload) => {
    const newClass = {
      id: Date.now(),
      name: payload.name,
      subject: payload.subject,
      students: payload.students,
      materials: 0,
      lastActivity: payload.lastActivity,
    };

    queryClient.setQueryData(['teacherClasses'], (old) => {
      const prev = Array.isArray(old) ? old : classesList;
      return [newClass, ...prev];
    });
  };

  const handleViewDetails = (cls) => {
    setSelectedClass(cls);
    setIsDetailsOpen(true);
  };

  if (isClassesLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (classesError) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
        Unable to load classes right now.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Cohorts Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your active cohorts and tracked subjects.
          </p>
        </div>
        <div>
          <Button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Cohort
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
        <ClassesTable classes={classesList} onViewDetails={handleViewDetails} />
      </motion.div>

      <AddClassDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSubmit={handleAddClass} />
      <ClassDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        cls={selectedClass}
      />
    </div>
  );
};

export default ClassesOverviewPage;
