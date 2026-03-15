import { Clock, CheckSquare, BrainCircuit, Library } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const AnalyticsSummaryCards = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      title: "Total Study Hours",
      value: summary.totalStudyHours,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      delay: 0.1,
    },
    {
      title: "Notes Completed",
      value: summary.notesCompleted,
      icon: CheckSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      delay: 0.2,
    },
    {
      title: "AI Questions Asked",
      value: summary.aiQuestionsAsked,
      icon: BrainCircuit,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      delay: 0.3,
    },
    {
      title: "Subjects Studied",
      value: summary.subjectsStudied,
      icon: Library,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.delay }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsSummaryCards;
