import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectApprovals, useProjectApprovalActions } from '../hooks/useDepartmentData';
import { ProjectDetailsDialog } from '../components/ProjectDetailsDialog';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  Approved: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Rejected: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const ProjectApprovalsPage = () => {
  const { data, isLoading } = useProjectApprovals();
  const { approve, reject, isApproving, isRejecting } = useProjectApprovalActions();
  const isBusy = isApproving || isRejecting;

  const [statusFilter, setStatusFilter] = useState('Pending');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const approvals = data?.approvals || [];

  const filteredApprovals = useMemo(() => {
    if (statusFilter === 'all') return approvals;
    return approvals.filter(p => p.status === statusFilter);
  }, [approvals, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: approvals.length,
      Pending: approvals.filter(p => p.status === 'Pending').length,
      Approved: approvals.filter(p => p.status === 'Approved').length,
      Rejected: approvals.filter(p => p.status === 'Rejected').length,
    };
  }, [approvals]);

  const openDetails = (project) => {
    setSelectedProject(project);
    setDetailsOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Approvals</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Review, approve, or reject student project submissions.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          Loading project submissions...
        </div>
      ) : (
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="Pending">Pending ({counts.Pending})</TabsTrigger>
            <TabsTrigger value="Approved">Approved ({counts.Approved})</TabsTrigger>
            <TabsTrigger value="Rejected">Rejected ({counts.Rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} forceMount>
            <div className="grid gap-4">
              {filteredApprovals.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="link"
                    className="h-auto p-0 font-semibold text-gray-900 dark:text-white justify-start"
                    onClick={() => openDetails(project)}
                    title="Open project files"
                  >
                    {project.title}
                  </Button>
                  <Badge variant="outline" className={statusColors[project.status] || ''}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted by {project.student} • <span className="flex-inline items-center gap-1"><Clock className="h-3 w-3 inline" /> {project.date}</span>
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={() => openDetails(project)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> View Project Files
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                onClick={() => approve(project.id)}
                disabled={isBusy || project.status !== 'Pending'}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                onClick={() => reject(project.id)}
                disabled={isBusy || project.status !== 'Pending'}
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </div>
          </motion.div>
              ))}

              {filteredApprovals.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  No projects found for the selected filter.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <ProjectDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setSelectedProject(null);
        }}
        project={selectedProject}
      />
    </div>
  );
};

export default ProjectApprovalsPage;
