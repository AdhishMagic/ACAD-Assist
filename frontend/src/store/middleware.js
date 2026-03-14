export const apiMiddleware = (_store) => (next) => (action) => {
  // Middleware for logging, analytics, or error tracking
  if (action.type?.endsWith("/rejected")) {
    console.error("Action rejected:", action.type, action.payload);
  }
  return next(action);
};
