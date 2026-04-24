import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NotesToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  onFilterClick, 
  isFilterActive,
  sortBy,
  onSortChange 
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="Search by title, subject, or tags..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-muted/50 border-border/50 focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
        <Button 
          variant={isFilterActive ? "secondary" : "outline"} 
          size="sm"
          className={`h-9 gap-2 sm:w-auto ${isFilterActive ? 'border-primary/20 bg-primary/10 text-primary' : ''}`}
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {isFilterActive && <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>}
        </Button>

        <div className="flex h-9 w-full items-center overflow-hidden rounded-md border border-border/50 sm:w-auto">
          <div className="flex h-full items-center border-r border-border/50 bg-muted/50 px-3">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground font-medium">Sort</span>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-full min-w-0 flex-1 cursor-pointer bg-card px-3 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-0 sm:min-w-[140px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NotesToolbar;
