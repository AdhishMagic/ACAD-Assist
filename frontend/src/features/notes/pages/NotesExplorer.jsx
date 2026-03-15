import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotes } from '../hooks/useNotes';
import SubjectSidebar from '../components/SubjectSidebar';
import NotesToolbar from '../components/NotesToolbar';
import NotesFilters from '../components/NotesFilters';
import NotesGrid from '../components/NotesGrid';
import NotePreviewPanel from '../components/NotePreviewPanel';

// Mock data fallback since there is no real API returning data
const MOCK_NOTES = [
  { id: 1, title: 'Introduction to Algorithms', subject: 'Computer Science', author: 'Dr. Smith', createdAt: '2026-03-10T10:00:00Z', isBookmarked: true, tags: ['Important', 'Exam Prep'], readTime: 12, previewImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop', excerpt: 'A comprehensive overview of sorting and searching algorithms starting with Big O notation.' },
  { id: 2, title: 'Cell Biology Notes', subject: 'Biology', author: 'Prof. Johnson', createdAt: '2026-03-12T14:30:00Z', isBookmarked: false, tags: ['Reading Material'], readTime: 8, excerpt: 'Detailed structure of eukaryotic cells, focusing on the mitochondria and nucleus.' },
  { id: 3, title: 'World War II Summary', subject: 'History', author: 'Ms. Davis', createdAt: '2026-03-14T09:15:00Z', isBookmarked: true, tags: ['Lecture', 'Important'], readTime: 15, excerpt: 'Key events leading up to the war, major theaters of conflict, and the aftermath.' },
  { id: 4, title: 'Calculus III Formulas', subject: 'Mathematics', author: 'Mr. Wilson', createdAt: '2026-03-15T08:00:00Z', isBookmarked: false, tags: ['Assignment'], readTime: 5, excerpt: 'Cheat sheet for multivariable calculus including gradient, divergence, and curl.' }
];

const NotesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ teachers: [], tags: [] });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);

  // Using the hook we created (will fail gracefully or stay loading without a real backend, so we fallback to mock)
  const { data, isLoading, error } = useNotes({ search: searchTerm, sort: sortBy, filters: activeFilters });
  
  // Use mock data if API is not wired up
  const notes = data?.notes || MOCK_NOTES;
  const loading = false; // Set this to isLoading when API is ready

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <SubjectSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">All Notes</h1>
            <p className="text-muted-foreground">Browse and explore study materials across all subjects.</p>
          </div>

          <NotesToolbar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isFilterActive={isFilterActive}
            onFilterClick={() => setIsFilterActive(!isFilterActive)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="overflow-hidden">
            <NotesFilters 
              isOpen={isFilterActive}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              onClear={() => {
                setActiveFilters({ teachers: [], tags: [] });
                setIsFilterActive(false);
              }}
            />
          </div>

          <div className="flex-1 pb-10">
            {/* NoteGrid needs an onNoteClick prop added in standard usage. For now, assuming NoteCard utilizes a passed in prop if present. */}
            <NotesGrid 
              notes={notes} 
              isLoading={loading} 
              onNoteClick={setSelectedNote}
            />
          </div>
        </div>
      </main>

      {/* Right Panel - Note Preview */}
      <NotePreviewPanel 
        note={selectedNote} 
        onClose={() => setSelectedNote(null)} 
      />
    </div>
  );
};

export default NotesExplorer;
