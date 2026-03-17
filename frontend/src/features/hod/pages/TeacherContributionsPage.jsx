import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TeacherContributionTable } from '../components/TeacherContributionTable';
import { useTeacherContributions } from '../hooks/useDepartmentData';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function TeacherContributionsPage() {
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const { data, isLoading } = useTeacherContributions({ course: courseFilter, date: dateFilter });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading teacher contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="flex-1 space-y-6 flex flex-col p-4 sm:p-6 lg:p-8 pt-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Teacher Contributions</h2>
        <p className="text-muted-foreground mt-1">Evaluate teacher productivity and content creation</p>
      </div>

      <TeacherContributionTable
        contributions={data?.teachers}
        courses={data?.courses || []}
        selectedCourse={courseFilter}
        onCourseFilter={setCourseFilter}
        selectedDate={dateFilter}
        onDateFilter={setDateFilter}
      />
    </motion.div>
  );
}
