import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNoteDetails } from '../hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, User, FileDown, BookMarked, Share2, Printer, Tag } from 'lucide-react';
import BookmarkButton from '../components/BookmarkButton';
import MarkdownViewer from '../components/MarkdownViewer';
import { downloadNoteAsPdf, printNote } from '../utils/noteActions';



const NotesViewer = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useNoteDetails(noteId);

  const note = data;

  if (isLoading && !data) {
    return <div className="p-10 text-center w-full">Loading Note...</div>;
  }

  return (
    <div className="flex w-full h-full bg-background overflow-hidden flex-col lg:flex-row">
      {/* Main Content Viewer */}
      <main className="flex-1 h-full overflow-y-auto scroll-smooth border-r border-border p-6 md:p-10 lg:p-14">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-8 text-muted-foreground hover:text-foreground pl-0 group"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to notes
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                {note.subject}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-foreground leading-tight">
              {note.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-10 pb-10 border-b border-border/50">
              <div className="flex items-center space-x-2 text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                <span>{note.author}</span>
              </div>
            </div>

            <div className="pb-24">
              <MarkdownViewer content={note.content} />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Right Metadata Panel */}
      <aside className="w-full lg:w-80 border-t lg:border-t-0 border-border bg-card/50 lg:h-full overflow-y-auto hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 space-y-8">
          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Actions</h4>
            <Button
              className="w-full justify-start text-left bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              onClick={() => downloadNoteAsPdf(note)}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" className="w-full justify-start text-left bg-background hover:bg-muted border-border/50">
              <BookmarkButton noteId={note.id} isBookmarked={note.isBookmarked} className="h-4 w-4 mr-2 p-0 -ml-1 text-foreground" />
              Save Note
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-muted-foreground hover:text-foreground"
              onClick={() => printNote(note)}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="w-full h-px bg-border/50"></div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-muted hover:bg-muted/80 text-muted-foreground transition-colors cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="w-full h-px bg-border/50"></div>

          {/* Related Notes */}
          {note.relatedNotes && note.relatedNotes.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center mb-4">
                <BookMarked className="h-4 w-4 mr-2 text-muted-foreground" />
                Related Materials
              </h4>
              <div className="space-y-3">
                {note.relatedNotes.map((related) => (
                  <div 
                    key={related.id} 
                    className="p-3 bg-muted/40 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition-colors group"
                  >
                    <h5 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default NotesViewer;
