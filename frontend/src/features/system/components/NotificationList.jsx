import { motion, AnimatePresence } from "framer-motion";
import { NotificationItem } from "./NotificationItem";
import { Button } from "@/components/ui/button";
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from "../hooks/useNotifications";
import { Loader2 } from "lucide-react";

export const NotificationList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Flatten infinite query pages
  const notifications = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button variant="outline" size="sm" onClick={() => markAllAsRead.mutate()}>
          Mark all as read
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={(id) => markAsRead.mutate(id)} 
            />
          ))}
        </AnimatePresence>
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
