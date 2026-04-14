import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import SavedNoteCard from "../components/SavedNoteCard";
import { useBookmarkedNotes } from "@/features/notes/hooks/useNotes";

export default function SavedNotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: bookmarkData, isLoading } = useBookmarkedNotes();

  // Transform bookmarked notes to match SavedNoteCard structure
  const notes = useMemo(() => {
    if (!bookmarkData?.notes) return [];
    return bookmarkData.notes.map(note => ({
      id: note.id,
      title: note.title,
      topic: note.subject || 'General',
      preview: note.excerpt || note.content?.slice(0, 220) || '',
      dateSaved: note.createdAt || new Date().toISOString(),
    }));
  }, [bookmarkData]);

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery) return notes;
    const lowerQ = searchQuery.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQ) || 
      note.topic.toLowerCase().includes(lowerQ)
    );
  }, [notes, searchQuery]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Saved / Bookmarked Notes</h1>
          <p className="text-muted-foreground text-lg">
            Review and manage all your bookmarked study materials in one place.
          </p>
        </div>
        <div className="relative max-w-sm w-full md:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search notes or subjects..." 
            className="pl-10 h-11 bg-card shadow-sm border-muted-foreground/20 rounded-full focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-lg font-medium animate-pulse">Loading your bookmarked notes...</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredNotes.map((note) => (
            <SavedNoteCard 
              key={note.id} 
              note={note} 
              onDelete={(id) => console.log('Delete Bookmark', id)} 
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-muted/10 rounded-2xl border-2 border-dashed border-border flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6 shadow-sm border">
            <BookOpen className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-foreground">No saved notes</h3>
          <p className="text-muted-foreground text-lg max-w-sm">
            {searchQuery ? "Try adjusting your search query or filters." : "Start bookmarking notes to save them for later. Click the bookmark icon on any note to get started."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
