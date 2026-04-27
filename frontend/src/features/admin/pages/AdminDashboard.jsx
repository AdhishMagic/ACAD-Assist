import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, GraduationCap, Presentation, BrainCircuit, HardDrive, Activity, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "../hooks/useAdminData";
import AdminStatsCard from "../components/AdminStatsCard";

export const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="responsive-title">Admin Dashboard</h2>
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
    <div className="flex-1 space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-5 py-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.95)] sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_left,rgba(168,85,247,0.12),transparent_24%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
              System overview
            </div>
            <div className="space-y-2">
              <h2 className="responsive-title text-white">Admin Dashboard</h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Keep an eye on platform growth, daily AI activity, and operational health from one clean control surface.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">User mix</div>
              <div className="mt-2 text-lg font-semibold text-white">{data.activeStudents + data.activeTeachers}</div>
              <div className="text-xs text-slate-400">active members</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">AI throughput</div>
              <div className="mt-2 text-lg font-semibold text-white">{data.aiRequestsToday?.toLocaleString() ?? 0}</div>
              <div className="text-xs text-slate-400">requests today</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3 col-span-2 sm:col-span-1">
              <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">Storage</div>
              <div className="mt-2 text-lg font-semibold text-white">{data.storageUsed}</div>
              <div className="text-xs text-slate-400">currently allocated</div>
            </div>
          </div>
        </div>
      </motion.section>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-5">
        <AdminStatsCard 
          title="Total Users" 
          value={data.totalUsers} 
          icon={Users} 
          trend={{ value: 12, isPositive: true }} 
          tone="blue"
          helper="Registered accounts across all roles."
          delay={0.1} 
        />
        <AdminStatsCard 
          title="Active Students" 
          value={data.activeStudents} 
          icon={GraduationCap} 
          trend={{ value: 5, isPositive: true }} 
          tone="emerald"
          helper="Students currently engaging with materials."
          delay={0.2} 
        />
        <AdminStatsCard 
          title="Active Teachers" 
          value={data.activeTeachers} 
          icon={Presentation} 
          trend={{ value: 2, isPositive: true }} 
          tone="violet"
          helper="Faculty members contributing this cycle."
          delay={0.3} 
        />
        <AdminStatsCard 
          title="AI Requests Today" 
          value={data.aiRequestsToday?.toLocaleString()} 
          icon={BrainCircuit} 
          trend={{ value: 18, isPositive: true }} 
          tone="amber"
          helper="Assistant generations processed today."
          delay={0.4} 
        />
        <AdminStatsCard 
          title="Storage Used" 
          value={data.storageUsed} 
          icon={HardDrive} 
          trend={{ value: 4, isPositive: false }} 
          tone="rose"
          helper="Platform storage consumed by uploads and assets."
          delay={0.5} 
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 border-white/8 bg-white/[0.03] shadow-[0_20px_45px_-30px_rgba(15,23,42,0.95)] md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-white">Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentActivity.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
                >
                  <span className={`relative mt-1 flex h-2.5 w-2.5 shrink-0 ${
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
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-6 text-white">{activity.message}</p>
                    <p className="text-sm text-slate-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-white/8 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.95)] lg:col-span-3">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg text-white">
              <Sparkles className="mr-2 h-5 w-5 text-blue-300" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="border-b border-white/8 pb-4 text-sm leading-6 text-slate-400">
              Access common administration tools and system configurations.
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/admin/users" className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/[0.08]">
                <Users className="mr-2 h-4 w-4 text-blue-300" />
                Manage Users
              </Link>
              <Link to="/admin/analytics" className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-white/[0.08]">
                <span className="flex items-center">
                  <Activity className="mr-2 h-4 w-4 text-violet-300" />
                  View Detailed Analytics
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
