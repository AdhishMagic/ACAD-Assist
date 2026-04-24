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
    <div ref={containerRef} className="group relative hidden w-full min-w-0 max-w-xs lg:block xl:max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-500 dark:text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="block w-full rounded-lg border border-slate-200 bg-slate-100/50 py-2 pl-10 pr-12 leading-5 text-slate-900 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-border dark:bg-secondary dark:text-gray-50 dark:placeholder:text-gray-400 dark:focus:bg-secondary sm:text-sm"
        placeholder="Search courses, notes, users or tests..."
        value={query}
        onFocus={openSearch}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
        <kbd className="hidden rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 font-sans text-[10px] font-medium tracking-widest text-slate-500 dark:border-border dark:bg-card dark:text-gray-400 sm:inline-block">
          Cmd K
        </kbd>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-border dark:bg-card dark:shadow-black/40">
          <div className="border-b border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-border dark:text-gray-300">
            {trimmedQuery ? 'Global search results' : 'Start typing to search across your workspace'}
          </div>

          <div className="max-h-[22rem] overflow-y-auto">
            {isLoading && trimmedQuery && (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-slate-600 dark:text-gray-200">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {!isLoading && !trimmedQuery && (
              <div className="px-3 py-4 text-sm text-slate-600 dark:text-gray-200">
                Try keywords like React, Midterm, or Jane.
              </div>
            )}

            {!isLoading && trimmedQuery && results.length === 0 && (
              <div className="flex items-center gap-2 px-3 py-5 text-sm text-slate-600 dark:text-gray-200">
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
                        className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-500/15'
                            : 'hover:bg-slate-100 dark:hover:bg-surface-hover'
                        }`}
                      >
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-secondary dark:text-gray-200">
                          <TypeIcon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-800 dark:text-gray-50">{result.title}</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-gray-300">{result.description}</span>
                        </span>
                        <span className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400 dark:text-gray-400">{result.type}</span>
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
