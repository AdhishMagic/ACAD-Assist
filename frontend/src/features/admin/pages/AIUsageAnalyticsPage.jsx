import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BrainCircuit, Bolt, Users } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import AIUsageChart from '../components/AIUsageChart';
import { Card, CardContent } from "@/components/ui/card";

const formatNumberShort = (value) => {
  const numeric = Number(value || 0);
  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(1)}M`;
  }
  if (numeric >= 1_000) {
    return `${(numeric / 1_000).toFixed(1)}K`;
  }
  return `${numeric}`;
};

const AIUsageAnalyticsPage = () => {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ['admin-ai-stats'],
    queryFn: adminAPI.getAiUsageStats,
  });

  const stats = statsResponse?.data;
  const summary = stats?.summary || {};
  const totalTokens = formatNumberShort(summary.totalTokens);
  const avgGenTime = `${Number(summary.avgGenTimeSeconds || 0).toFixed(2)}s`;
  const activeAiUsers = Number(summary.activeAiUsers || 0);

  return (
    <div className="dashboard-stack mx-auto w-full max-w-7xl">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          <BrainCircuit className="h-6 w-6 text-purple-600" />
          AI Usage Analytics
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          Monitor your platform's AI interaction, query volumes, and popular features.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-md">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-purple-100 text-sm font-medium">Total Tokens Used</p>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl break-words">{isLoading ? '...' : totalTokens}</h3>
                <p className="text-xs text-purple-200 mt-1">Across all AI interactions</p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5 sm:p-3">
                <Bolt className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none shadow-md">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-blue-100 text-sm font-medium">Average Gen Time</p>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl break-words">{isLoading ? '...' : avgGenTime}</h3>
                <p className="text-xs text-blue-200 mt-1">Average latency per request</p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5 sm:p-3">
                <BrainCircuit className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-md">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-emerald-100 text-sm font-medium">Active AI Users</p>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl break-words">{isLoading ? '...' : activeAiUsers}</h3>
                <p className="text-xs text-emerald-200 mt-1">Users with recorded AI activity</p>
              </div>
              <div className="rounded-lg bg-white/20 p-2.5 sm:p-3">
                <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIUsageChart stats={stats} isLoading={isLoading} />
    </div>
  );
};

export default AIUsageAnalyticsPage;
