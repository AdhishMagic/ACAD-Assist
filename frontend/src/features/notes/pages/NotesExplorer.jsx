import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotes } from '../hooks/useNotes';
import SubjectSidebar from '../components/SubjectSidebar';
import NotesToolbar from '../components/NotesToolbar';
import NotesFilters from '../components/NotesFilters';
import NotesGrid from '../components/NotesGrid';
import NotePreviewPanel from '../components/NotePreviewPanel';


const NotesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ teachers: [], tags: [] });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);

  // Using the hook we created (will fail gracefully or stay loading without a real backend, so we fallback to mock)
  const { data, isLoading, error } = useNotes({ search: searchTerm, sort: sortBy, filters: activeFilters });
  
  const notes = data?.notes || [];

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
              isLoading={isLoading} 
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
