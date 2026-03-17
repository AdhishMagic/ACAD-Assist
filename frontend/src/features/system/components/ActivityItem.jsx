import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, UserPlus, Zap } from 'lucide-react';

const getIconForType = (type) => {
  switch (type) {
    case 'upload': return FileText;
    case 'user_join': return UserPlus;
    case 'ai_action': return Zap;
    default: return Clock;
  }
};

const getColorForType = (type) => {
  switch (type) {
    case 'upload': return 'bg-blue-100 text-blue-600';
    case 'user_join': return 'bg-green-100 text-green-600';
    case 'ai_action': return 'bg-purple-100 text-purple-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const ActivityItem = ({ activity }) => {
  const Icon = getIconForType(activity.type);
  const colorClass = getColorForType(activity.type);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex gap-4 p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-auto">
        <div className="flex justify-between gap-x-4">
          <div className="py-0.5 text-sm leading-5 text-gray-600">
            <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
          </div>
          <time dateTime={activity.timestamp} className="flex-none py-0.5 text-xs leading-5 text-gray-400">
            {activity.timeAgo}
          </time>
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-500">{activity.description}</p>
      </div>
    </motion.div>
  );
};
