import { motion } from 'framer-motion';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const buildStatsOverview = (stats = {}) => {
  const hoursValue = Number(stats.studyHours || 0);
  const displayHours = Number.isInteger(hoursValue) ? `${hoursValue}h` : `${hoursValue.toFixed(1)}h`;

  return [
    {
      title: 'Courses Enrolled',
      value: String(stats.coursesEnrolled ?? 0),
      icon: BookOpen,
      trend: stats.coursesTrend || 'Based on your active subjects',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Notes Completed',
      value: String(stats.notesCompleted ?? 0),
      icon: FileText,
      trend: stats.notesTrend || 'No new notes this week',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Tests Completed',
      value: String(stats.testsCompleted ?? 0),
      icon: CheckCircle,
      trend: stats.testsTrend || 'No graded tests yet',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Study Hours',
      value: displayHours,
      icon: Clock,
      trend: stats.studyHoursTrend || '0h this week',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    },
  ];
};

const StudyProgressCard = ({ stats = {} }) => {
  const statsOverview = buildStatsOverview(stats);

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {statsOverview.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StudyProgressCard;
