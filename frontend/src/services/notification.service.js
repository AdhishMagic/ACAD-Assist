export const notificationService = {
  success(message) { console.log("[SUCCESS]", message); },
  error(message) { console.error("[ERROR]", message); },
  warning(message) { console.warn("[WARNING]", message); },
  info(message) { console.info("[INFO]", message); },
};
