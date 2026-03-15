import React from 'react';
import { Menu, Bell, Moon, Sun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Navbar = ({ toggleSidebar, toggleRightPanel, isDark, toggleTheme }) => {
  return (
    <header className="h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 z-20">
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex items-center mr-8">
          <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            ACAD-Assist
          </Link>
        </div>

        <SearchBar />
      </div>

      <div className="ml-4 flex items-center space-x-3 sm:space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link to="/notifications" className="relative p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
        </Link>

        <button 
          onClick={toggleRightPanel}
          className="hidden lg:flex items-center justify-center p-1.5 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors relative group"
        >
          <Sparkles className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        </button>

        <div className="h-6 border-l border-gray-200 dark:border-gray-700 mx-2"></div>

        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
