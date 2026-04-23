import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText, Sparkles } from 'lucide-react';

const TeacherStatsCard = ({ title, value, icon: Icon, description, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
              <Icon size={24} />
            </div>
          </div>
          {(description || trend) && (
            <div className="mt-4 flex items-center gap-2">
              {trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const DashboardStatsGrid = ({ data }) => {
  if (!data) return null;

  const stats = [
    { title: 'Total Cohorts', value: data.totalClasses, icon: BookOpen, description: 'Active cohorts this semester', delay: 0.1 },
    { title: 'Uploaded Notes', value: data.uploadedNotes, icon: FileText, description: 'Total materials shared', trend: 12, delay: 0.2 },
    { title: 'Active Students', value: data.activeStudents, icon: Users, description: 'Engaged with materials', trend: 5, delay: 0.3 },
    { title: 'AI Generated', value: data.aiGeneratedMaterials, icon: Sparkles, description: 'Quizzes & Summaries created', trend: 24, delay: 0.4 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <TeacherStatsCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default TeacherStatsCard;
