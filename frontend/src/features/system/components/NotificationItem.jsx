import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Info, FileText, Bot } from "lucide-react";

const getIcon = (type) => {
  switch (type) {
    case "announcement":
      return <Info className="h-5 w-5 text-blue-500" />;
    case "alert":
      return <FileText className="h-5 w-5 text-yellow-500" />;
    case "ai":
      return <Bot className="h-5 w-5 text-purple-500" />;
    case "test":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Info className="h-5 w-5 text-gray-500" />;
  }
};

export const NotificationItem = ({ notification, onMarkAsRead }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 flex gap-4 items-start ${notification.read ? "bg-muted/50" : "bg-card"}`}>
        <div className="mt-1">{getIcon(notification.type)}</div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
              {notification.message}
            </p>
            {!notification.read && <Badge variant="secondary">New</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(notification.date).toLocaleString()}
          </p>
        </div>
        {!notification.read && (
          <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
            Mark read
          </Button>
        )}
      </Card>
    </motion.div>
  );
};
