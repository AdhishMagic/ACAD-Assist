import React from 'react';
import { ActivityItem } from './ActivityItem';
import { EmptyState } from './EmptyState';
import { motion } from 'framer-motion';

export const ActivityFeedList = ({ activities = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex space-x-4 p-4 border border-gray-100 rounded-lg bg-white">
            <div className="rounded-full bg-gray-200 h-10 w-10 shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return <EmptyState title="No recent activity" description="Check back later for updates on system events." />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } }
      }}
      className="space-y-4"
    >
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </motion.div>
  );
};
