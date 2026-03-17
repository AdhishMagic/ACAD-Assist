import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseApprovalTable } from '../components/CourseApprovalTable';
import { useMaterialApprovals } from '../hooks/useDepartmentData';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function CourseMaterialsApprovalPage() {
  const { data, isLoading } = useMaterialApprovals();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApprovals = useMemo(() => {
    if (!data?.approvals) return [];
    if (statusFilter === 'all') return data.approvals;
    return data.approvals.filter(item => item.status === statusFilter);
  }, [data?.approvals, statusFilter]);

  const counts = useMemo(() => {
    if (!data?.approvals) return { all: 0, Pending: 0, Approved: 0, Rejected: 0 };
    return {
      all: data.approvals.length,
      Pending: data.approvals.filter(a => a.status === 'Pending').length,
      Approved: data.approvals.filter(a => a.status === 'Approved').length,
      Rejected: data.approvals.filter(a => a.status === 'Rejected').length,
    };
  }, [data?.approvals]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading material approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div {...pageTransition} className="flex-1 space-y-6 flex flex-col p-4 sm:p-6 lg:p-8 pt-6 h-full overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Course Materials Approval</h2>
        <p className="text-muted-foreground mt-1">Review and manage teacher material submissions</p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="Pending">Pending ({counts.Pending})</TabsTrigger>
          <TabsTrigger value="Approved">Approved ({counts.Approved})</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected ({counts.Rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} forceMount>
          <CourseApprovalTable
            approvals={filteredApprovals}
            title={statusFilter === 'all' ? 'All Materials' : `${statusFilter} Materials`}
            description={`Showing ${filteredApprovals.length} material${filteredApprovals.length !== 1 ? 's' : ''}`}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
