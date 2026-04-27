import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, BellRing, Info, X } from "lucide-react";
import { notificationService } from "@/services/notification.service";

const levelConfig = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-emerald-500/20 bg-emerald-500/10 text-emerald-50",
    iconColor: "text-emerald-300",
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-rose-500/20 bg-rose-500/10 text-rose-50",
    iconColor: "text-rose-300",
  },
  warning: {
    icon: BellRing,
    wrapper: "border-amber-500/20 bg-amber-500/10 text-amber-50",
    iconColor: "text-amber-300",
  },
  info: {
    icon: Info,
    wrapper: "border-blue-500/20 bg-blue-500/10 text-blue-50",
    iconColor: "text-blue-300",
  },
};

export function NotificationToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return notificationService.subscribe((toast) => {
      setToasts((current) => [...current, toast].slice(-4));

      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, toast.duration);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = levelConfig[toast.level] ?? levelConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto overflow-hidden rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${config.wrapper}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
                <div className="min-w-0 flex-1">
                  {toast.title ? (
                    <p className="text-sm font-semibold">{toast.title}</p>
                  ) : null}
                  <p className="text-sm leading-5 text-white/90">{toast.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                  className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default NotificationToastViewport;
