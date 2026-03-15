import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 my-1 rounded-md transition-colors duration-200 group relative ${
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        }`
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <motion.span
        initial={false}
        animate={{ 
          opacity: isCollapsed ? 0 : 1, 
          width: isCollapsed ? 0 : 'auto',
          marginLeft: isCollapsed ? 0 : 12,
          display: isCollapsed ? 'none' : 'block'
        }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap overflow-hidden text-sm font-medium"
      >
        {label}
      </motion.span>
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 w-max px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
