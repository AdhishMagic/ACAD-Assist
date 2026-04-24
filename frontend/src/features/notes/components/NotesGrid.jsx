import React from 'react';
import { motion } from 'framer-motion';
import NoteCard from './NoteCard';
import { FileQuestion } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const NotesGrid = ({ notes = [], isLoading = false, onNoteClick, emptyStateTitle = '📭 No published notes available', emptyStateMessage = '' }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-xl bg-muted/50 animate-pulse border border-border/50"></div>
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center p-6 text-center sm:min-h-[400px] sm:p-12">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{emptyStateTitle}</h3>
        {emptyStateMessage ? <p className="text-muted-foreground max-w-sm">{emptyStateMessage}</p> : null}
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <NoteCard note={note} onNoteClick={onNoteClick} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesGrid;
