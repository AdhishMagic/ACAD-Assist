import React from 'react';
import { HardDrive, Cloud, Users, FileType2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StorageUsageCard = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const usedPercentage = Number(stats?.capacity?.usedPercent || 0);
  const totalCapacity = stats?.capacity?.total || 'N/A';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Used</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsed || '0 GB'}</div>
            <p className="text-xs text-gray-500 mt-1">out of {totalCapacity}</p>
            <Progress value={usedPercentage} className="h-2 mt-3" indicatorClassName="bg-blue-600" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Storage</CardTitle>
            <Cloud className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.available || '0 GB'}</div>
            <p className="text-xs text-gray-500 mt-1">Free space remaining</p>
            <Progress value={100 - usedPercentage} className="h-2 mt-3" indicatorClassName="bg-green-500" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Per User Average</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.perUserAvg || '0 MB'}</div>
            <p className="text-xs text-gray-500 mt-1">Across all active accounts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Top File Type</CardTitle>
            <FileType2 className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.byType?.[0]?.type || 'N/A'}</div>
            <p className="text-xs text-gray-500 mt-1">{stats?.byType?.[0]?.value || 0}% of all files</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StorageUsageCard;
