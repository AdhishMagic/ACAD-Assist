import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, GraduationCap, Presentation, BrainCircuit, HardDrive, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "../hooks/useAdminData";
import AdminStatsCard from "../components/AdminStatsCard";

export const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>
        <div className="flex h-[400px] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <AdminStatsCard 
          title="Total Users" 
          value={data.totalUsers} 
          icon={Users} 
          trend={{ value: 12, isPositive: true }} 
          delay={0.1} 
        />
        <AdminStatsCard 
          title="Active Students" 
          value={data.activeStudents} 
          icon={GraduationCap} 
          trend={{ value: 5, isPositive: true }} 
          delay={0.2} 
        />
        <AdminStatsCard 
          title="Active Teachers" 
          value={data.activeTeachers} 
          icon={Presentation} 
          trend={{ value: 2, isPositive: true }} 
          delay={0.3} 
        />
        <AdminStatsCard 
          title="AI Requests Today" 
          value={data.aiRequestsToday?.toLocaleString()} 
          icon={BrainCircuit} 
          trend={{ value: 18, isPositive: true }} 
          delay={0.4} 
        />
        <AdminStatsCard 
          title="Storage Used" 
          value={data.storageUsed} 
          icon={HardDrive} 
          trend={{ value: 4, isPositive: false }} 
          delay={0.5} 
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {data.recentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className="flex items-center"
                >
                  <span className={`relative flex h-2 w-2 mr-4 ${
                    activity.type === 'user_registered' ? 'bg-blue-500' :
                    activity.type === 'notes_uploaded' ? 'bg-green-500' :
                    activity.type === 'ai_spike' ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      activity.type === 'user_registered' ? 'bg-blue-400' :
                      activity.type === 'notes_uploaded' ? 'bg-green-400' :
                      activity.type === 'ai_spike' ? 'bg-amber-400' : 'bg-red-400'
                    }`}></span>
                  </span>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 shadow-sm border bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground border-b pb-4">
              Access common administration tools and system configurations.
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/admin/users" className="text-sm rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border shadow-sm hover:shadow-md transition-shadow text-left font-medium flex items-center">
                <Users className="w-4 h-4 mr-2 text-indigo-500" />
                Manage Users
              </Link>
              <Link to="/admin/analytics" className="text-sm rounded-md px-4 py-2 bg-white dark:bg-zinc-900 border shadow-sm hover:shadow-md transition-shadow text-left font-medium text-indigo-600 dark:text-indigo-400 mt-2">
                View Detailed Analytics &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
