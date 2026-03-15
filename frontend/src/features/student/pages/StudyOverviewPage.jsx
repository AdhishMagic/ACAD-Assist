import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Lightbulb, Target, BookOpen, AlertCircle } from 'lucide-react';
import StudyStatsChart from '../components/StudyStatsChart';

const subjectsProgress = [
  { name: 'Computer Networks', progress: 60, color: 'bg-blue-500' },
  { name: 'Operating Systems', progress: 40, color: 'bg-orange-500' },
  { name: 'Databases', progress: 75, color: 'bg-emerald-500' },
  { name: 'Data Structures', progress: 90, color: 'bg-purple-500' },
];

const insights = [
  { 
    title: 'Most Studied Subject', 
    desc: 'You\'ve spent 12 hours on Databases this week. Great dedication!', 
    icon: BookOpen, 
    color: 'text-emerald-500', 
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' 
  },
  { 
    title: 'Needs Attention', 
    desc: 'Operating Systems test scores are below average. Consider reviewing Process Synchronization.', 
    icon: AlertCircle, 
    color: 'text-orange-500', 
    bgColor: 'bg-orange-100 dark:bg-orange-900/20' 
  },
  { 
    title: 'Recommended Topic', 
    desc: 'Based on recent activity, revising "Network Layers" would be beneficial.', 
    icon: Lightbulb, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-100 dark:bg-blue-900/20' 
  },
];

const StudyOverviewPage = () => {
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
          <StudyStatsChart />
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
                  const Icon = insight.icon;
                  return (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-white dark:bg-black/40 rounded-lg border shadow-sm">
                      <div className={`p-2 rounded-full mt-0.5 ${insight.bgColor}`}>
                        <Icon className={`w-4 h-4 ${insight.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {insight.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudyOverviewPage;
