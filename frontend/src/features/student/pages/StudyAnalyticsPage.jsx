import { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart2, RefreshCw } from "lucide-react";
import { useStudyAnalytics } from "../hooks/useStudyAnalytics";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import StudyHoursChart from "../components/StudyHoursChart";
import SubjectProgressCard from "../components/SubjectProgressCard";
import AIUsageChart from "../components/AIUsageChart";
import LearningInsights from "../components/LearningInsights";
import { Button } from "@/components/ui/button";

const StudyAnalyticsPage = () => {
  const { 
    summary, 
    studyHours, 
    subjectProgress, 
    aiUsage, 
    insights, 
    isLoading, 
    isError, 
    refetchAll 
  } = useStudyAnalytics();

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading analytics data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="p-4 bg-destructive/10 rounded-full">
          <BarChart2 className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Failed to load analytics</h2>
        <p className="text-muted-foreground max-w-md">
          There was a problem fetching your study data. Please try again later.
        </p>
        <Button onClick={refetchAll} variant="outline" className="mt-4 gap-2">
          <RefreshCw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="container max-w-7xl mx-auto space-y-8 pb-12 overflow-hidden" // overflow-hidden prevents horizontal scroll during animations
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Analytics</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Track your progress, monitor habits, and uncover insights to improve faster.
          </p>
        </div>
        <Button onClick={refetchAll} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* Primary Metrics Layer */}
      <AnalyticsSummaryCards summary={summary} />

      {/* Main Charts Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudyHoursChart data={studyHours} />
        <SubjectProgressCard progressData={subjectProgress} />
      </div>

      {/* Secondary Level Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIUsageChart data={aiUsage} />
        <LearningInsights insights={insights} />
      </div>

    </motion.div>
  );
};

export default StudyAnalyticsPage;
