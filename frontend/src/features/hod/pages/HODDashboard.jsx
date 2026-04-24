import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, AlertCircle, Clock, Upload, Sparkles, GraduationCap, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DepartmentStatsCard } from '../components/DepartmentStatsCard';
import { useDashboardData } from '../hooks/useDepartmentData';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const activityIcons = {
  upload: <Upload className="h-4 w-4" />,
  'ai-generate': <Sparkles className="h-4 w-4" />,
  update: <FileText className="h-4 w-4" />,
  schedule: <Clock className="h-4 w-4" />,
  grade: <GraduationCap className="h-4 w-4" />,
};

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const alertConfig = {
  warning: { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  error: { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  success: { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  info: { icon: Info, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
};

export default function HODDashboard() {
  const { data, isLoading, isError, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center min-h-[400px]">
        <div className="max-w-md text-center space-y-2">
          <p className="text-lg font-semibold">Unable to load HOD dashboard</p>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'The dashboard could not fetch data from the connected backend.'}
          </p>
        </div>
      </div>
    );
  }

  const recentTeacherActivity = data?.recentTeacherActivity || [];
  const recentCourseSubmissions = data?.recentCourseSubmissions || [];
  const departmentAlerts = data?.departmentAlerts || [];

  return (
    <motion.div {...pageTransition} className="flex h-full flex-1 flex-col space-y-5 overflow-y-auto sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">HOD Dashboard</h2>
          <p className="text-muted-foreground mt-1">Department overview and recent activity</p>
        </div>
      </div>

      <DepartmentStatsCard stats={data?.stats} trends={data?.trends} />

      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Teacher Activity</CardTitle>
            <CardDescription>Latest actions by department teachers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTeacherActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No recent teacher activity found in the database.</p>
            )}

            {recentTeacherActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  {activityIcons[activity.type] || <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{activity.teacher}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Course Submissions</CardTitle>
            <CardDescription>Latest materials submitted for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCourseSubmissions.length === 0 && (
              <p className="text-sm text-muted-foreground">No course submissions found in the database.</p>
            )}

            {recentCourseSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium truncate">{submission.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{`${submission.teacher} • ${submission.date}`}</p>
                </div>
                <Badge variant="outline" className={statusColors[submission.status] || ''}>
                  {submission.status}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Alerts</CardTitle>
          <CardDescription>Important notifications and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {departmentAlerts.length === 0 && (
            <p className="text-sm text-muted-foreground">No department alerts at the moment.</p>
          )}

          {departmentAlerts.map((alert, index) => {
            const config = alertConfig[alert.severity] || alertConfig.info;
            const AlertIcon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className={`h-8 w-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <AlertIcon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
