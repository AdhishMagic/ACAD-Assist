import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import ActivityLogTable from '../components/ActivityLogTable';

const ActivityLogsPage = () => {
  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: adminAPI.getActivityLogs,
  });

  const logs = logsResponse?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          Activity Logs
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor system activities and user actions across the platform.
        </p>
      </div>

      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <ActivityLogTable logs={logs} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ActivityLogsPage;
