import React from 'react';
import { motion } from 'framer-motion';
import { PerformanceChart } from '../components/PerformanceChart';
import { usePerformanceData } from '../hooks/useDepartmentData';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function DepartmentPerformancePage() {
  const { data, isLoading } = usePerformanceData();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="flex-1 space-y-6 flex flex-col p-4 sm:p-6 lg:p-8 pt-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Department Performance</h2>
        <p className="text-muted-foreground mt-1">Analyze department academic and content performance</p>
      </div>

      <PerformanceChart data={data} />
    </motion.div>
  );
}
