import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, User, FileText, Download, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildPath } from '@/app/routes/routePaths';
import BookmarkButton from './BookmarkButton';
import { useNoteDetails } from '../hooks/useNotes';
import { downloadNoteAsPdf } from '../utils/noteActions';

const NotePreviewPanel = ({ note, onClose }) => {
  const navigate = useNavigate();
  const { data: noteDetails, isLoading: isNoteDetailsLoading } = useNoteDetails(note?.id);

  return (
    <AnimatePresence>
      {note && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 lg:w-96 flex-shrink-0 border-l border-border bg-card shadow-xl absolute right-0 top-0 bottom-0 z-20 md:relative flex flex-col h-full"
        >
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h2 className="font-semibold text-lg">Note Preview</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header info */}
            <div className="space-y-4">
              {note.previewImage && (
                <div className="w-full h-48 rounded-xl overflow-hidden bg-muted border border-border/50">
                  <img src={note.previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold leading-tight">{note.title}</h3>
                  <BookmarkButton noteId={note.id} isBookmarked={note.isBookmarked} />
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {note.subject}
                </Badge>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex items-center space-x-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{note.author}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{note.readTime || '5'} min read</span>
              </div>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-background">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description/Excerpt */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Summary</h4>
              <p className="text-sm text-balance leading-relaxed text-muted-foreground">
                {note.excerpt || 'No description available for this note.'}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/10 flex flex-col gap-3">
            <Button 
              className="w-full gap-2" 
              onClick={() => navigate(buildPath.studentNoteViewer(note.id))}
            >
              <ExternalLink className="h-4 w-4" />
              Open Full Note
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={isNoteDetailsLoading}
              onClick={() => downloadNoteAsPdf(noteDetails || note)}
            >
              <Download className="h-4 w-4" />
              {isNoteDetailsLoading ? 'Preparing...' : 'Download PDF'}
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default NotePreviewPanel;
