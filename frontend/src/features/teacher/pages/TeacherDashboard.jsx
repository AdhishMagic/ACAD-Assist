import React from 'react';
import { motion } from 'framer-motion';
import { useTeacherDashboard } from '../hooks/useTeacherDashboard';
import { DashboardStatsGrid } from '../components/TeacherStatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { dashboardData, isDashboardLoading, dashboardError } = useTeacherDashboard();

  if (isDashboardLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex h-64 items-center justify-center text-center text-sm text-gray-500 dark:text-gray-400">
        Unable to load teacher dashboard data right now.
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 sm:space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="responsive-title text-gray-900 dark:text-white">Teacher Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Welcome back! Here's an overview of your teaching activities.
          </p>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <Link to="/teacher/notes-studio">
            <Button className="w-full bg-primary text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" /> Create Materials
            </Button>
          </Link>
        </div>
      </div>

      <DashboardStatsGrid data={dashboardData} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-bold flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Recently Uploaded Notes
              </CardTitle>
              <Link to="/teacher/classes" className="text-sm text-primary hover:underline font-medium">View all</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {dashboardData.recentNotes.map((note) => (
                  <div key={note.id} className="group flex flex-col gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{note.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{note.subject}</p>
                    </div>
                    <span className="w-fit text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{note.date}</span>
                  </div>
                ))}
                {dashboardData.recentNotes.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No recent notes uploaded.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-lg font-bold flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Recent Student Activity
              </CardTitle>
              <Link to="/teacher/activity" className="text-sm text-blue-500 hover:underline font-medium">View all</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {dashboardData.recentInteractions.map((interaction, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">
                        <span className="font-bold">{interaction.studentName}</span> {interaction.action.toLowerCase()}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400 sm:max-w-[250px]">{interaction.item}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 whitespace-nowrap sm:ml-2">{interaction.time}</span>
                  </div>
                ))}
                {dashboardData.recentInteractions.length === 0 && (
                  <div className="p-8 text-center text-gray-500">No recent activity.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800/30 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold flex items-center text-indigo-950 dark:text-indigo-100">
              <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
              Latest AI Generated Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 relative z-10">
              {dashboardData.latestAI.map((ai) => (
                <div key={ai.id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1">
                      <Sparkles size={10} /> {ai.type}
                    </span>
                    <span className="text-xs text-gray-400">{ai.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{ai.title}</h4>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
