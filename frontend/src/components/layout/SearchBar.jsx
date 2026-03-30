import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Search, SearchX, BookOpen, GraduationCap, Users, FileQuestion, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '@/features/system/hooks/useGlobalSearch';

const iconByType = {
  notes: BookOpen,
  courses: GraduationCap,
  users: Users,
  tests: FileQuestion,
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const trimmedQuery = query.trim();
  const { data, isLoading } = useGlobalSearch(trimmedQuery);

  const results = useMemo(() => data?.results || [], [data]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedQuery, results.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSearch = () => setIsOpen(true);

  const onSelectResult = (result) => {
    if (!result?.url) return;
    setIsOpen(false);
    setQuery('');
    navigate(result.url);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      if (!results.length) return;
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev + 1) % results.length);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
      return;
    }

    if (e.key === 'Enter' && trimmedQuery) {
      e.preventDefault();
      const selected = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (selected) {
        onSelectResult(selected);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md hidden md:block group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="block w-full pl-10 pr-12 py-2 bg-slate-100/50 border border-slate-200 rounded-lg leading-5 dark:bg-[#0f172a]/50 dark:border-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#0f172a] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        placeholder="Search courses, notes, users or tests..."
        value={query}
        onFocus={openSearch}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-block border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-widest font-sans">
          ⌘K
        </kbd>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {trimmedQuery ? 'Global search results' : 'Start typing to search across your workspace'}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {isLoading && trimmedQuery && (
              <div className="px-3 py-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {!isLoading && !trimmedQuery && (
              <div className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                Try keywords like React, Midterm, or Jane.
              </div>
            )}

            {!isLoading && trimmedQuery && results.length === 0 && (
              <div className="px-3 py-5 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <SearchX className="h-4 w-4" />
                No results found.
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <ul className="py-1">
                {results.map((result, index) => {
                  const TypeIcon = iconByType[result.type] || LinkIcon;
                  const isActive = index === activeIndex;

                  return (
                    <li key={result.id || `${result.url}-${index}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => onSelectResult(result)}
                        className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <TypeIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{result.title}</span>
                          <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{result.description}</span>
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 mt-0.5">{result.type}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
