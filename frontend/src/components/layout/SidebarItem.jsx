import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed, isActive = false }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg transition-all duration-200 ease-in-out group relative overflow-hidden ${
        isActive
          ? 'bg-blue-50/90 text-blue-700 visited:text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:visited:text-blue-300 shadow-sm'
          : 'text-gray-600 visited:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:visited:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r transition-all duration-200 ${
          isActive ? 'bg-blue-600 dark:bg-blue-400 opacity-100' : 'opacity-0'
        }`}
      />

      <Icon
        className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ease-in-out group-hover:scale-105 ${
          isActive
            ? 'text-blue-600 dark:text-blue-300'
            : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-300'
        }`}
      />
      <motion.span
        initial={false}
        animate={{ 
          opacity: isCollapsed ? 0 : 1, 
          width: isCollapsed ? 0 : 'auto',
          marginLeft: isCollapsed ? 0 : 2,
          display: isCollapsed ? 'none' : 'block'
        }}
        transition={{ duration: 0.24, ease: 'easeInOut' }}
        className="whitespace-nowrap overflow-hidden text-sm font-medium"
      >
        {label}
      </motion.span>
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 w-max px-2.5 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-md">
          {label}
        </div>
      )}
    </Link>
  );
};

export default SidebarItem;
