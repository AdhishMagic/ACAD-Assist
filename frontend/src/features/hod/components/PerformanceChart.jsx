import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const chartTooltipStyle = {
  borderRadius: '8px',
  border: '1px solid hsl(var(--border))',
  backgroundColor: 'hsl(var(--background))',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '8px 12px',
  fontSize: '12px',
};

const chartReveal = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 },
};

export function PerformanceChart({ data }) {
  if (!data) return null;

  return (
    <motion.div {...chartReveal}>
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Analyze department academic and content performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="courseActivity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courseActivity">Course Activity</TabsTrigger>
              <TabsTrigger value="materials">Materials per Course</TabsTrigger>
              <TabsTrigger value="aiContent">AI Content Usage</TabsTrigger>
            </TabsList>

            {/* Course Activity Chart */}
            <TabsContent value="courseActivity">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.courseActivity} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="activeCourses" name="Active Courses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="completions" name="Completions" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="enrollments" name="Enrollments" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </TabsContent>

            {/* Materials per Course Chart */}
            <TabsContent value="materials">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.materialsPerCourse} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="notes" name="Notes" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="videos" name="Videos" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="assignments" name="Assignments" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </TabsContent>

            {/* AI Content Usage Chart */}
            <TabsContent value="aiContent">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.aiContentUsage} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="perfGenerated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="perfReviewed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="perfPublished" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="generated" name="Generated" stroke="hsl(217, 91%, 60%)" fill="url(#perfGenerated)" strokeWidth={2} />
                    <Area type="monotone" dataKey="reviewed" name="Reviewed" stroke="hsl(262, 83%, 58%)" fill="url(#perfReviewed)" strokeWidth={2} />
                    <Area type="monotone" dataKey="published" name="Published" stroke="hsl(142, 76%, 36%)" fill="url(#perfPublished)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
