import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { CheckCircle, MessageSquare, Edit3, Clock } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const getActivityVisuals = (type) => {
  if (type === 'test') {
    return {
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    };
  }

  if (type === 'ai') {
    return {
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    };
  }

  return {
    icon: Edit3,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  };
};

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="relative border-l border-muted ml-3 mt-4 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activities.map((activity) => {
            const visuals = getActivityVisuals(activity.type);
            const Icon = visuals.icon;
            return (
              <motion.div key={activity.id} variants={itemVariants} className="relative pl-6">
                <div className={`absolute -left-3.5 top-0.5 p-1.5 rounded-full ${visuals.bgColor} ring-4 ring-card`}>
                  <Icon className={`w-3.5 h-3.5 ${visuals.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{activity.title}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{activity.time}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        {activities.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No recent activity to show.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
