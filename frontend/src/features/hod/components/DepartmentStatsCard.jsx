import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statConfig = {
  totalTeachers: { icon: Users, label: 'Total Teachers', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  activeCourses: { icon: BookOpen, label: 'Active Courses', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  uploadedMaterials: { icon: FileText, label: 'Uploaded Materials', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/40' },
  studentEngagementRate: { icon: Activity, label: 'Student Engagement Rate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
};

export function DepartmentStatsCard({ stats, trends }) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(stats).map(([key, value], index) => {
        const config = statConfig[key];
        if (!config) return null;
        const Icon = config.icon;
        const trend = trends?.[key];

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {config.label}
                </CardTitle>
                <div className={`h-9 w-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {key === 'studentEngagementRate' ? `${value}%` : value.toLocaleString()}
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                    trend.direction === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{trend.change}% from last month</span>
                  </div>
                )}
              </CardContent>
              {/* Decorative gradient strip */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                key === 'totalTeachers' ? 'from-blue-500 to-blue-600' :
                key === 'activeCourses' ? 'from-emerald-500 to-emerald-600' :
                key === 'uploadedMaterials' ? 'from-violet-500 to-violet-600' :
                'from-amber-500 to-amber-600'
              }`} />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
