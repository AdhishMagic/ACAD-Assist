import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PanelLeft } from 'lucide-react';
import { useNoteSubjects, useSubjectNotes } from '../hooks/useNotes';
import SubjectSidebar from '../components/SubjectSidebar';
import NotesToolbar from '../components/NotesToolbar';
import NotesFilters from '../components/NotesFilters';
import NotesGrid from '../components/NotesGrid';
import NotePreviewPanel from '../components/NotePreviewPanel';
import { Button } from '@/components/ui/button';



const SubjectNotesPage = () => {
  const { subjectId } = useParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ subject: subjectId || '', tags: [] });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);

  const { data, isLoading } = useSubjectNotes(subjectId, { search: searchTerm, sort: sortBy, filters: activeFilters });
  const { data: subjectData } = useNoteSubjects();
  
  const subjects = Array.isArray(subjectData) ? subjectData : [];
  const selectedSubject = subjects.find((item) => String(item.id) === String(subjectId));
  const formattedSubject = selectedSubject?.name || 'Subject';
  
  const notes = data?.notes || [];
  const tags = useMemo(
    () => [...new Set(notes.flatMap((note) => (Array.isArray(note.tags) ? note.tags : [])))].sort((a, b) => a.localeCompare(b)),
    [notes]
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background md:flex-row">
      {/* Left Sidebar */}
      <SubjectSidebar isOpen={isSubjectsOpen} onClose={() => setIsSubjectsOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="page-shell flex h-full w-full flex-col py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 border-b border-border/50 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-3 sm:p-4">
                <BookOpen className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
              </div>
              <div>
                <h1 className="responsive-title mb-1 text-foreground">{formattedSubject}</h1>
                <p className="text-sm text-muted-foreground sm:text-base">Explore all notes and materials for {formattedSubject}.</p>
              </div>
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

          {/* Toolbar & Filters */}
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
                setActiveFilters({ subject: subjectId || '', tags: [] });
                setIsFilterActive(false);
              }}
            />
          </div>

          {/* Notes Grid Layout */}
          <div className="flex-1 pb-8 sm:pb-10">
            <NotesGrid notes={notes} isLoading={isLoading} onNoteClick={setSelectedNote} />
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

export default SubjectNotesPage;
