import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookmarkNote } from '../hooks/useNotes';

const BookmarkButton = ({ noteId, isBookmarked = false, className = '' }) => {
  const { mutate, isPending } = useBookmarkNote();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full hover:bg-primary/10 transition-colors ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutate(noteId);
      }}
      disabled={isPending}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark note"}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-5 w-5 text-primary fill-primary" />
        ) : (
          <Bookmark className="h-5 w-5 text-muted-foreground" />
        )}
      </motion.div>
    </Button>
  );
};

export default BookmarkButton;
