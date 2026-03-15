import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const SubjectProgressCard = ({ progressData }) => {
  if (!progressData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>Completion status across courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressData.map((subject, index) => (
             <div key={index} className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="font-medium text-sm">{subject.subject}</span>
                 <Badge variant="secondary" className="font-semibold">
                   {subject.progress}%
                 </Badge>
               </div>
               <Progress 
                value={subject.progress} 
                className="h-2 cursor-pointer" 
                indicatorColor={subject.color}
              />
             </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SubjectProgressCard;
