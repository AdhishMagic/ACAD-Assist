import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Lightbulb, Target, BookOpen, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import StudyStatsChart from '../components/StudyStatsChart';
import { selectCurrentUser } from '@/features/auth/store/authSlice';
import { useStudentOverview } from '../hooks/useStudentDashboard';

const StudyOverviewPage = () => {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useStudentOverview(user?.id);

  const chartData = data?.chartData || [];
  const subjectsProgress = data?.subjectProgress || [];
  const insights = data?.insights || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const getInsightVisuals = (type) => {
    if (type === 'success') {
      return {
        icon: BookOpen,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
      };
    }

    if (type === 'warning') {
      return {
        icon: AlertCircle,
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      };
    }

    return {
      icon: Lightbulb,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    };
  };

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Study Overview</h1>
        <p className="text-muted-foreground mt-1">Detailed analytics and AI-powered insights for your academic journey.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <StudyStatsChart data={chartData} />
          {isLoading && <p className="text-sm text-muted-foreground mt-3">Loading study analytics...</p>}
          {isError && <p className="text-sm text-red-500 mt-3">Unable to load study analytics right now.</p>}
        </motion.div>

        {/* Side Panel: Progress and Insights */}
        <div className="space-y-6 lg:col-span-1">
          {/* Subject Progress */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Subject Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {subjectsProgress.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5 font-medium">
                      <span>{subject.name}</span>
                      <span className="text-muted-foreground">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className={`h-2`} indicatorColor={subject.color} />
                  </div>
                ))}
                {subjectsProgress.length === 0 && (
                  <p className="text-sm text-muted-foreground">No subject progress available yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  AI Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, idx) => {
                  const visuals = getInsightVisuals(insight.type);
                  const Icon = visuals.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3 rounded-lg border bg-white p-3 shadow-sm dark:border-border dark:bg-card dark:shadow-black/20">
                      <div className={`p-2 rounded-full mt-0.5 ${visuals.bgColor}`}>
                        <Icon className={`w-4 h-4 ${visuals.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {insights.length === 0 && (
                  <p className="text-sm text-muted-foreground">No insights available yet. Keep studying to unlock recommendations.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyOverviewPage;
