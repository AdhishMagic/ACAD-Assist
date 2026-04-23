import React from 'react';
import { useStudentActivity } from '../hooks/useTeacherDashboard';
import StudentActivityTable from '../components/StudentActivityTable';
import { motion } from 'framer-motion';

const StudentActivityPage = () => {
  const { activityData, isActivityLoading, activityError } = useStudentActivity();

  if (isActivityLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (activityError) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
        Unable to load student activity right now.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Student Activity</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor engagement and identify students who may need assistance.
        </p>
      </div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StudentActivityTable activityData={activityData} />
      </motion.div>
    </div>
  );
};

export default StudentActivityPage;
