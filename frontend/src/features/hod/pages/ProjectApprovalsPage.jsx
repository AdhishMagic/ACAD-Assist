import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pendingProjects = [
  { id: 1, student: "Alice Johnson", title: "AI-Based Attendance System", date: "2026-03-15", status: "pending" },
  { id: 2, student: "Bob Smith", title: "Blockchain Certificate Verification", date: "2026-03-14", status: "pending" },
];

const ProjectApprovalsPage = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Approvals</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Review, approve, or reject student project submissions.
        </p>
      </div>

      <div className="grid gap-4">
        {pendingProjects.map((project, index) => (
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
                <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted by {project.student} • <span className="flex-inline items-center gap-1"><Clock className="h-3 w-3 inline" /> {project.date}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800">
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </div>
          </motion.div>
        ))}
        {pendingProjects.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            No pending projects to review.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApprovalsPage;
