const APP_NOTIFICATION_EVENT = "acad-assist:notification";

function emitNotification(level, message, options = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(APP_NOTIFICATION_EVENT, {
      detail: {
        id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        level,
        message,
        title: options.title || null,
        duration: options.duration ?? 4500,
      },
    }),
  );
}

export const notificationService = {
  eventName: APP_NOTIFICATION_EVENT,
  subscribe(callback) {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handler = (event) => callback(event.detail);
    window.addEventListener(APP_NOTIFICATION_EVENT, handler);
    return () => window.removeEventListener(APP_NOTIFICATION_EVENT, handler);
  },
  success(message, options) {
    emitNotification("success", message, options);
  },
  error(message, options) {
    emitNotification("error", message, options);
  },
  warning(message, options) {
    emitNotification("warning", message, options);
  },
  info(message, options) {
    emitNotification("info", message, options);
  },
};
