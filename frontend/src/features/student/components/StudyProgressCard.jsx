import { motion } from 'framer-motion';
import { BookOpen, FileText, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

const statsOverview = [
  {
    title: 'Courses Enrolled',
    value: '6',
    icon: BookOpen,
    trend: '+2 from last semester',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    title: 'Notes Completed',
    value: '24',
    icon: FileText,
    trend: '+5 this week',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
  {
    title: 'Tests Completed',
    value: '12',
    icon: CheckCircle,
    trend: '85% average score',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    title: 'Study Hours',
    value: '18h',
    icon: Clock,
    trend: 'This week',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
  },
];

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

const StudyProgressCard = ({ stats = statsOverview }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => {
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
