import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-200">
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            ACAD-Assist
          </a>
          <nav className="space-x-4">
            <a href="/choose-role" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">Log in</a>
            <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">Sign up</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ACAD-Assist. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
