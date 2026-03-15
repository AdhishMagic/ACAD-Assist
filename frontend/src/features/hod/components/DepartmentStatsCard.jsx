import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statIcons = {
  totalTeachers: <Users className="h-4 w-4 text-primary" />,
  activeCourses: <BookOpen className="h-4 w-4 text-primary" />,
  uploadedMaterials: <FileText className="h-4 w-4 text-primary" />,
  studentEngagementRate: <Activity className="h-4 w-4 text-primary" />
};

const statLabels = {
  totalTeachers: "Total Teachers",
  activeCourses: "Active Courses",
  uploadedMaterials: "Uploaded Materials",
  studentEngagementRate: "Student Engagement Rate"
};

export function DepartmentStatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(stats).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {statLabels[key]}
              </CardTitle>
              {statIcons[key]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {key === 'studentEngagementRate' ? `${value}%` : value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
