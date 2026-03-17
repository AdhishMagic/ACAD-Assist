import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import StorageUsageCard from '../components/StorageUsageCard';
import FileStorageTable from '../components/FileStorageTable';

const StorageManagementPage = () => {
  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-storage-stats'],
    queryFn: adminAPI.getStorageStats,
  });

  const { data: filesResponse, isLoading: filesLoading } = useQuery({
    queryKey: ['admin-storage-files'],
    queryFn: adminAPI.getFiles,
  });

  const stats = statsResponse?.data;
  const files = filesResponse?.data || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" />
          Storage Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor system file storage, track usage, and manage large files.
        </p>
      </div>

      <div className="space-y-6">
        <StorageUsageCard stats={stats} isLoading={statsLoading} />
        
        <FileStorageTable files={files} isLoading={filesLoading} />
      </div>
    </div>
  );
};

export default StorageManagementPage;
