import React from 'react';
import { motion } from 'framer-motion';
import { CourseApprovalTable } from '../components/CourseApprovalTable';
import { useCourseApprovals } from '../hooks/useDepartmentData';

export default function CourseApprovalPage() {
  const { data, isLoading } = useCourseApprovals();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading approval requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 flex flex-col p-8 pt-6 h-full overflow-y-auto">
      <motion.div 
        className="flex items-center justify-between space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold tracking-tight">Course Approval System</h2>
      </motion.div>

      <div className="space-y-6">
        <CourseApprovalTable approvals={data?.approvals} />
      </div>
    </div>
  );
}
