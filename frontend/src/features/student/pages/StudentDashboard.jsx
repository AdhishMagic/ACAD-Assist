import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Sparkles, PlayCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import StudyProgressCard from '../components/StudyProgressCard';
import RecentNotes from '../components/RecentNotes';
import UpcomingTests from '../components/UpcomingTests';
import AIQuickAssistant from '../components/AIQuickAssistant';
import ActivityTimeline from '../components/ActivityTimeline';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import { getDisplayNameFromUser } from '@/utils/helpers';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data: dashboardData, isLoading, isError } = useStudentDashboard(user?.id);
  const studentName = dashboardData?.studentName || getDisplayNameFromUser(user) || 'Student';
  const stats = dashboardData?.stats || {};
  const recentNotes = dashboardData?.recentNotes || [];
  const schedules = dashboardData?.schedules || dashboardData?.upcomingTests || [];
  const recentActivity = dashboardData?.recentActivity || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-5 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {studentName}!</h1>
          <p className="text-muted-foreground mt-1">Ready to crush your goals today? You're doing great!</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/student/ai')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Ask AI
          </Button>
          <Button variant="outline" onClick={() => navigate('/student/study-overview')}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex" onClick={() => navigate('/student/notes')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Notes
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <StudyProgressCard stats={stats} />
      </motion.div>

      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading your dashboard data...</div>
      )}

      {isError && (
        <div className="text-sm text-red-500">Unable to load dashboard data right now.</div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <motion.div variants={itemVariants} className="space-y-5 lg:col-span-2 lg:space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
            <RecentNotes notes={recentNotes} />
            <UpcomingTests tests={schedules} />
          </div>
          <div className="h-[300px] md:h-auto">
            <AIQuickAssistant />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <ActivityTimeline activities={recentActivity} />
        </motion.div>
      </div>

    </motion.div>
  );
};

export default StudentDashboard;
