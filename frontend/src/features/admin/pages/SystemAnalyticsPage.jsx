import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAnalytics } from "../hooks/useAdminData";
import SystemUsageChart from "../components/SystemUsageChart";
import UserGrowthChart from "../components/UserGrowthChart";
import { TrendingUp, Users, HardDrive, Clock } from "lucide-react";

export const SystemAnalyticsPage = () => {
  const { data, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Daily Active Users", value: data.metrics.dailyActiveUsers, icon: Users, color: "text-blue-500" },
          { title: "Avg Session Length", value: data.metrics.avgSessionLength, icon: Clock, color: "text-amber-500" },
          { title: "Monthly Uploads", value: data.metrics.totalUploadsMonthly.toLocaleString(), icon: HardDrive, color: "text-green-500" },
          { title: "Platform Uptime", value: data.metrics.platformUptime, icon: TrendingUp, color: "text-indigo-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <UserGrowthChart data={data.userGrowth} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SystemUsageChart data={data.systemUsage} />
        </motion.div>
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;
