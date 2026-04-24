import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const NotesFilters = ({ isOpen, activeFilters, onFilterChange, onClear, subjects = [], tags = [] }) => {
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
          <div className="space-y-6 rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-2 border-b border-border/50 pb-3 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {/* Subject Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">By Subject</h4>
                <div className="flex flex-col space-y-2">
                  <select
                    value={activeFilters?.subject || ''}
                    onChange={(event) => onFilterChange({ ...activeFilters, subject: event.target.value })}
                    className="h-10 rounded-md border border-border/70 bg-background px-3 text-sm"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">By Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
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
                  {tags.length === 0 ? <p className="text-sm text-muted-foreground">No tags available yet.</p> : null}
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
