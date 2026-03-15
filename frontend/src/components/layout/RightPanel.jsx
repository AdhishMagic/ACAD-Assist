import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BookMarked, Clock } from 'lucide-react';

const RightPanel = ({ isOpen, closePanel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden lg:flex flex-col h-[calc(100vh-4rem)] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-16 right-0 overflow-hidden flex-shrink-0 z-10"
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>AI Assistant Context</span>
            </div>
            <button 
              onClick={closePanel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Suggestions */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Suggestions</h3>
              <div className="space-y-2">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-indigo-700 dark:text-indigo-400">Pro tip:</span> Generate a quick quiz from your latest notes to reinforce learning.
                </div>
              </div>
            </div>

            {/* Recent Notes */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <BookMarked className="h-3 w-3 mr-1" /> Related Materials
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start cursor-pointer group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Neural Networks Basics</p>
                    <p className="text-xs text-gray-500">Updated 2h ago</p>
                  </div>
                </li>
                <li className="flex items-start cursor-pointer group">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Data Structures Midterm</p>
                    <p className="text-xs text-gray-500">Generated yesterday</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Activity */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Recent Activity
              </h3>
              <div className="relative border-l border-gray-200 dark:border-gray-700 ml-2 space-y-4 pb-4">
                <div className="relative pl-4">
                  <div className="absolute w-2.5 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full -left-1.5 top-1.5 border border-white dark:border-gray-900"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Reviewed <span className="font-medium">OS Chapter 4</span></p>
                  <span className="text-xs text-gray-400">10:30 AM</span>
                </div>
                <div className="relative pl-4">
                  <div className="absolute w-2.5 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full -left-1.5 top-1.5 border border-white dark:border-gray-900"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Created new study guide</p>
                  <span className="text-xs text-gray-400">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default RightPanel;
