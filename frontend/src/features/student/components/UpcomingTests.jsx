import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar, Timer, BookOpen, ArrowRight } from 'lucide-react';

const UpcomingTests = ({ tests = [] }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-500" />
          Upcoming Schedules
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          View Schedule <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4 mt-2">
          {tests.map((test, index) => (
            <motion.div 
              key={test.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 4 }}
              className="flex flex-col p-3 rounded-lg border border-l-4 border-l-orange-500 bg-card hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-sm">{test.name}</span>
                <span className="text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded">
                  {test.date}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {test.subject}
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" />
                  {test.duration}
                </div>
              </div>
            </motion.div>
          ))}
          {tests.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No schedules available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTests;
