import React, { useEffect, useRef } from 'react';
import { Search, Monitor, FileText, User, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { CommandItem } from './CommandItem';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: Monitor, href: '/dashboard' },
  { id: 'notes', label: 'Open Notes', icon: FileText, href: '/student/notes' },
  { id: 'profile', label: 'Open Profile', icon: User, href: '/profile' },
  { id: 'activity', label: 'View Activity Feed', icon: Bell, href: '/activity-feed' }
];

export const CommandPalette = () => {
  const { isOpen, setIsOpen, searchQuery, setSearchQuery, executeCommand } = useCommandPalette();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[15%] z-[101] mx-auto max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-center border-b border-gray-100 px-4 py-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-900 placeholder:text-gray-400"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsOpen(false);
                }}
              />
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC</span>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggestions
                  </div>
                  {filteredCommands.map((command, idx) => (
                    <CommandItem
                      key={command.id}
                      icon={command.icon}
                      label={command.label}
                      active={idx === 0}
                      onSelect={() => executeCommand(command)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
