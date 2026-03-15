import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

// Mock filter data
const TEACHERS = ['Dr. Smith', 'Prof. Johnson', 'Ms. Davis', 'Mr. Wilson'];
const TAGS = ['Important', 'Exam Prep', 'Assignment', 'Lecture', 'Reading Material'];

const NotesFilters = ({ isOpen, activeFilters, onFilterChange, onClear }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden mb-6"
        >
          <div className="p-5 bg-card border border-border/50 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Advanced Filters
              </h3>
              <button 
                onClick={onClear}
                className="text-sm text-primary hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Teacher Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">By Teacher / Author</h4>
                <div className="flex flex-col space-y-2">
                  {TEACHERS.map((teacher) => (
                    <label key={teacher} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded border border-border/80 group-hover:border-primary peer-checked:bg-primary transition-colors">
                        <input
                          type="checkbox"
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                          checked={activeFilters?.teachers?.includes(teacher) || false}
                          onChange={(e) => {
                            const newTeachers = e.target.checked 
                              ? [...(activeFilters?.teachers || []), teacher]
                              : (activeFilters?.teachers || []).filter(t => t !== teacher);
                            onFilterChange({ ...activeFilters, teachers: newTeachers });
                          }}
                        />
                        {(activeFilters?.teachers?.includes(teacher)) && (
                          <svg className="w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {/* Custom checkbox background handler below */}
                        <div className={`absolute inset-0 rounded pointer-events-none transition-colors ${activeFilters?.teachers?.includes(teacher) ? 'bg-primary border-primary' : 'bg-transparent'}`}></div>
                      </div>
                      <span className="text-sm group-hover:text-foreground/80 transition-colors">
                        {teacher}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">By Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => {
                    const isActive = activeFilters?.tags?.includes(tag) || false;
                    return (
                      <Badge
                        key={tag}
                        variant={isActive ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'hover:bg-muted font-normal text-muted-foreground'
                        }`}
                        onClick={() => {
                          const newTags = isActive
                            ? (activeFilters?.tags || []).filter(t => t !== tag)
                            : [...(activeFilters?.tags || []), tag];
                          onFilterChange({ ...activeFilters, tags: newTags });
                        }}
                      >
                        {tag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotesFilters;
