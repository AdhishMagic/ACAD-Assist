import React from 'react';
import { motion } from 'framer-motion';
import { EngagementChart } from '../components/EngagementChart';
import { useStudentEngagement } from '../hooks/useDepartmentData';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function StudentEngagementPage() {
  const { data, isLoading } = useStudentEngagement();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading engagement data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="flex-1 space-y-6 flex flex-col p-4 sm:p-6 lg:p-8 pt-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Engagement</h2>
        <p className="text-muted-foreground mt-1">Monitor student learning participation and AI tool usage</p>
      </div>

      <EngagementChart data={data} />
    </motion.div>
  );
}
