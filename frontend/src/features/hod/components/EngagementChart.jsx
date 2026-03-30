import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
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

export function EngagementChart({ data }) {
  if (!data) return null;

  return (
    <motion.div {...chartReveal}>
      <Card>
        <CardHeader>
          <CardTitle>Student Engagement Analytics</CardTitle>
          <CardDescription>Monitor student learning participation and AI tool usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity per Course</TabsTrigger>
              <TabsTrigger value="studyHours">Avg Study Hours</TabsTrigger>
              <TabsTrigger value="aiUsage">AI Assistant Usage</TabsTrigger>
            </TabsList>

            {/* Student Activity per Course */}
            <TabsContent value="activity">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <BarChart data={data.activityPerCourse} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="activeStudents" name="Active Students" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="totalStudents" name="Total Students" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </TabsContent>

            {/* Avg Study Hours */}
            <TabsContent value="studyHours">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <LineChart data={data.avgStudyHours} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="h" />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value} hrs`, 'Avg Study Hours']} />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      name="Avg Study Hours"
                      stroke="hsl(262, 83%, 58%)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: 'hsl(262, 83%, 58%)', strokeWidth: 0 }}
                      activeDot={{ r: 7, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </TabsContent>

            {/* AI Assistant Usage */}
            <TabsContent value="aiUsage">
              <motion.div {...chartReveal} className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <AreaChart data={data.aiAssistantUsage} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="engQueries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="engNotes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="engQuizzes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="queries" name="AI Queries" stroke="hsl(217, 91%, 60%)" fill="url(#engQueries)" strokeWidth={2} />
                    <Area type="monotone" dataKey="notesGenerated" name="Notes Generated" stroke="hsl(142, 76%, 36%)" fill="url(#engNotes)" strokeWidth={2} />
                    <Area type="monotone" dataKey="quizzesTaken" name="Quizzes Taken" stroke="hsl(262, 83%, 58%)" fill="url(#engQuizzes)" strokeWidth={2} />
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
