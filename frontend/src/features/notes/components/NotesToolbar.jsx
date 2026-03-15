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
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm mb-6">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="Search notes by title, topic, or author..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-muted/50 border-border/50 focus-visible:ring-primary/20"
        />
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto self-end sm:self-auto">
        <Button 
          variant={isFilterActive ? "secondary" : "outline"} 
          size="sm"
          className={`gap-2 h-9 ${isFilterActive ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {isFilterActive && <span className="flex h-2 w-2 rounded-full bg-primary ml-1"></span>}
        </Button>

        <div className="flex items-center border border-border/50 rounded-md overflow-hidden h-9">
          <div className="px-3 bg-muted/50 border-r border-border/50 flex items-center h-full">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm text-muted-foreground font-medium">Sort</span>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-full bg-card px-3 text-sm focus:outline-none focus:ring-0 min-w-[120px] cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NotesToolbar;
