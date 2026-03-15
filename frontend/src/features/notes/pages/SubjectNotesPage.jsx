import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useSubjectNotes } from '../hooks/useNotes';
import NotesToolbar from '../components/NotesToolbar';
import NotesFilters from '../components/NotesFilters';
import NotesGrid from '../components/NotesGrid';



const SubjectNotesPage = () => {
  const { subjectId } = useParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ teachers: [], tags: [] });
  const [sortBy, setSortBy] = useState('newest');

  const { data, isLoading } = useSubjectNotes(subjectId, { search: searchTerm, sort: sortBy, filters: activeFilters });
  
  // Format subject title from ID (e.g., computer-networks -> Computer Networks)
  const formattedSubject = subjectId ? subjectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Subject';
  
  const notes = data?.notes || [];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background w-full">
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4 border-b border-border/50 pb-6">
          <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{formattedSubject}</h1>
            <p className="text-muted-foreground">Explore all notes and materials for {formattedSubject}.</p>
          </div>
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
            onClear={() => {
              setActiveFilters({ teachers: [], tags: [] });
              setIsFilterActive(false);
            }}
          />
        </div>

        {/* Notes Grid Layout */}
        <div className="flex-1 pb-10">
          <NotesGrid notes={notes} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default SubjectNotesPage;
