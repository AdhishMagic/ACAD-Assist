import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Trophy, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const LearningInsights = ({ insights }) => {
  if (!insights) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <Trophy className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'info':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return "bg-green-500/10 border-green-200/50";
      case 'warning':
        return "bg-orange-500/10 border-orange-200/50";
      case 'info':
        return "bg-blue-500/10 border-blue-200/50";
      default:
        return "bg-gray-500/10 border-gray-200/50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Learning Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-xl border ${getBgColor(insight.type)} flex gap-4 items-start transition-all hover:scale-[1.02] cursor-pointer`}
            >
              <div className="mt-1">
                {getIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.message}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground self-center opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LearningInsights;
