import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '@/app/routes/routePaths';
import BookmarkButton from './BookmarkButton';

const NoteCard = ({ note, onNoteClick }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="h-full flex flex-col cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300"
        onClick={() => {
          if (typeof onNoteClick === 'function') {
            onNoteClick(note);
            return;
          }
          navigate(buildPath.studentNoteViewer(note.id));
        }}
      >
        {/* Optional preview image/banner */}
        {note.previewImage ? (
          <div className="h-40 w-full overflow-hidden bg-muted">
            <img 
              src={note.previewImage} 
              alt={note.title} 
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          </div>
        ) : (
          <div className="h-32 w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}

        <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{note.title}</h3>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {note.subject}
            </Badge>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <BookmarkButton noteId={note.id} isBookmarked={note.isBookmarked} />
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 flex-grow">
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs text-muted-foreground">
                {tag}
              </Badge>
            ))}
            {note.tags?.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex items-center justify-between border-t border-border/50 mt-4">
          <div className="flex items-center space-x-1">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate max-w-[100px]">{note.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NoteCard;
