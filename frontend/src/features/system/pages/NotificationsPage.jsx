import { NotificationList } from "../components/NotificationList";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 md:p-8 max-w-3xl"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notification Center</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with your courses, notes, and AI assistant responses.
        </p>
      </div>

      <NotificationList />
    </motion.div>
  );
}
