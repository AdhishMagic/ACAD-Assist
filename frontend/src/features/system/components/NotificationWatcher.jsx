import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { notificationService } from "@/services/notification.service";
import { selectIsAuthenticated } from "@/features/auth/store/authSlice";
import { useNotificationSummary } from "../hooks/useNotifications";

const levelMethodMap = {
  success: "success",
  warning: "warning",
  info: "info",
};

export function NotificationWatcher() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const seenIdsRef = useRef(new Set());
  const initializedRef = useRef(false);
  const { data } = useNotificationSummary({
    pageSize: 8,
    refetchInterval: 12000,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      seenIdsRef.current = new Set();
      initializedRef.current = false;
      return;
    }

    const notifications = data?.data ?? [];
    if (!notifications.length) {
      return;
    }

    if (!initializedRef.current) {
      seenIdsRef.current = new Set(notifications.map((item) => item.id));
      initializedRef.current = true;
      return;
    }

    const freshNotifications = notifications.filter((item) => !seenIdsRef.current.has(item.id));
    if (!freshNotifications.length) {
      return;
    }

    freshNotifications
      .slice()
      .reverse()
      .forEach((notification) => {
        const method = levelMethodMap[notification.type] ?? "info";
        notificationService[method](notification.message, {
          title: notification.title,
        });
        seenIdsRef.current.add(notification.id);
      });
  }, [data, isAuthenticated]);

  return null;
}

export default NotificationWatcher;
