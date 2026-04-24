import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useNoteSubjects } from '../hooks/useNotes';
import SubjectSidebar from '../components/SubjectSidebar';
import NotesToolbar from '../components/NotesToolbar';
import NotesFilters from '../components/NotesFilters';
import NotesGrid from '../components/NotesGrid';
import NotePreviewPanel from '../components/NotePreviewPanel';


const NotesExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ subject: '', tags: [] });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);

  const { data, isLoading } = useNotes({ search: searchTerm, sort: sortBy, filters: activeFilters });
  const { data: subjectData } = useNoteSubjects();
  
  console.log("NOTES API RESPONSE:", data);

  const notes = data?.notes || [];
  const subjects = Array.isArray(subjectData) ? subjectData : [];
  const tags = [...new Set(notes.flatMap((note) => (Array.isArray(note.tags) ? note.tags : [])))].sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background md:flex-row">
      {/* Left Sidebar */}
      <SubjectSidebar isOpen={isSubjectsOpen} onClose={() => setIsSubjectsOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="page-shell flex h-full w-full flex-col py-4 sm:py-6 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="responsive-title mb-2 text-foreground">All Notes</h1>
              <p className="text-sm text-muted-foreground sm:text-base">Browse and explore study materials across all subjects.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center gap-2 md:hidden"
              onClick={() => setIsSubjectsOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
              Browse Subjects
            </Button>
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
              subjects={subjects}
              tags={tags}
              onClear={() => {
                setActiveFilters({ subject: '', tags: [] });
                setIsFilterActive(false);
              }}
            />
          </div>

          <div className="flex-1 pb-8 sm:pb-10">
            {/* NoteGrid needs an onNoteClick prop added in standard usage. For now, assuming NoteCard utilizes a passed in prop if present. */}
            <NotesGrid 
              notes={notes} 
              isLoading={isLoading} 
              onNoteClick={setSelectedNote}
              emptyStateTitle="📭 No published notes available"
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
