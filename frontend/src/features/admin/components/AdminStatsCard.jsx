import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const toneMap = {
  blue: {
    iconWrap: "bg-blue-500/12 text-blue-300 ring-1 ring-blue-400/20",
    accent: "from-blue-500/70 via-cyan-400/20 to-transparent",
    trend: "bg-blue-500/10 text-blue-200",
  },
  emerald: {
    iconWrap: "bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-400/20",
    accent: "from-emerald-500/70 via-green-400/20 to-transparent",
    trend: "bg-emerald-500/10 text-emerald-200",
  },
  violet: {
    iconWrap: "bg-violet-500/12 text-violet-300 ring-1 ring-violet-400/20",
    accent: "from-violet-500/70 via-fuchsia-400/20 to-transparent",
    trend: "bg-violet-500/10 text-violet-200",
  },
  amber: {
    iconWrap: "bg-amber-500/12 text-amber-300 ring-1 ring-amber-400/20",
    accent: "from-amber-500/70 via-orange-400/20 to-transparent",
    trend: "bg-amber-500/10 text-amber-200",
  },
  rose: {
    iconWrap: "bg-rose-500/12 text-rose-300 ring-1 ring-rose-400/20",
    accent: "from-rose-500/70 via-red-400/20 to-transparent",
    trend: "bg-rose-500/10 text-rose-200",
  },
};

export const AdminStatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  delay = 0,
  tone = "blue",
  helper,
}) => {
  const palette = toneMap[tone] ?? toneMap.blue;
  const TrendIcon = trend?.isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden border-white/8 bg-white/[0.03] shadow-[0_20px_45px_-30px_rgba(15,23,42,0.95)] backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-[0_24px_60px_-28px_rgba(59,130,246,0.28)]">
        <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${palette.accent}`} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_38%)] opacity-60" />
        <CardContent className="relative flex h-full flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-400">
                {title}
              </p>
              <div className="text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
                {value}
              </div>
            </div>
            {Icon && (
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${palette.iconWrap} transition-transform duration-300 group-hover:scale-105`}>
                <Icon className="h-5 w-5" />
              </div>
            )}
          </div>

          {helper && (
            <p className="text-sm leading-6 text-slate-400">
              {helper}
            </p>
          )}

          {trend && (
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-4">
              <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${trend.isPositive ? "bg-emerald-500/12 text-emerald-300" : "bg-rose-500/12 text-rose-300"}`}>
                <TrendIcon className="h-3.5 w-3.5" />
                <span>{trend.isPositive ? "+" : "-"}{trend.value}%</span>
              </div>
              <p className="text-xs text-slate-500">
                from last month
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminStatsCard;
