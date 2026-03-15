import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Sparkles, PlayCircle, BookOpen, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import StudyProgressCard from '../components/StudyProgressCard';
import RecentNotes from '../components/RecentNotes';
import UpcomingTests from '../components/UpcomingTests';
import AIQuickAssistant from '../components/AIQuickAssistant';
import ActivityTimeline from '../components/ActivityTimeline';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentName = 'Alex';

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
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {studentName}! 👋</h1>
          <p className="text-muted-foreground mt-1">Ready to crush your goals today? You're doing great!</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/ai-assistant')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Ask AI
          </Button>
          <Button variant="outline" onClick={() => navigate('/study-overview')}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Continue
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex" onClick={() => navigate('/notes')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Notes
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex" onClick={() => navigate('/tests')}>
            <FileCode className="w-4 h-4 mr-2" />
            Practice
          </Button>
        </div>
      </motion.div>

      {/* Progress Cards */}
      <motion.div variants={itemVariants}>
        <StudyProgressCard />
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentNotes />
            <UpcomingTests />
          </div>
          <div className="h-[300px] md:h-auto">
            <AIQuickAssistant />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <ActivityTimeline />
        </motion.div>
      </div>

    </motion.div>
  );
};

export default StudentDashboard;
