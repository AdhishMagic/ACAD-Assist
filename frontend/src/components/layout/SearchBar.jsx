import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-md hidden md:block group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-12 py-2 bg-slate-100/50 border border-slate-200 rounded-lg leading-5 dark:bg-[#0f172a]/50 dark:border-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-[#0f172a] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-block border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-widest font-sans">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};

export default SearchBar;
