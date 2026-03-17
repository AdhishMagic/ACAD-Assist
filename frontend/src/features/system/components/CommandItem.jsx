import React from 'react';
import { motion } from 'framer-motion';

export const CommandItem = ({ icon: Icon, label, shortcut, onSelect, active }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-md mb-1 transition-colors
        ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
    >
      <div className="flex items-center space-x-3">
        {Icon && <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {shortcut && (
        <div className="flex items-center space-x-1">
          {shortcut.map((key, idx) => (
            <kbd key={idx} className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 border border-gray-200 rounded shadow-sm">
              {key}
            </kbd>
          ))}
        </div>
      )}
    </motion.div>
  );
};
