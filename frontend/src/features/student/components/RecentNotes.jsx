import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentNotes = ({ notes = [] }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Recent Notes
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate('/student/notes')}>
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4 mt-2">
          {notes.map((note, index) => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="font-medium truncate text-sm">{note.title}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-secondary px-2 py-0.5 rounded-full">{note.subject}</span>
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-4">
                <Clock className="w-3 h-3 mr-1" />
                {note.lastOpened}
              </div>
            </motion.div>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No recent notes found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotes;
