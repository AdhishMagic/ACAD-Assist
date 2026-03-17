import React, { useState } from 'react';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { ActivityFeedList } from '../components/ActivityFeedList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const ActivityFeedPage = () => {
  const [filter, setFilter] = useState('all');
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useActivityFeed({ type: filter === 'all' ? undefined : filter });

  const activities = data?.pages.flatMap(page => page.items || (Array.isArray(page) ? page : [])) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pt-6 px-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Activity</h1>
          <p className="text-gray-500">Monitor all global events across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'upload', 'user_join', 'ai_action'].map(type => (
            <Button 
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className="capitalize"
            >
              {type.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>A real-time list of what's happening.</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeedList activities={activities} isLoading={isLoading} />
          
          {hasNextPage && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading more...' : 'Load More Options'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
