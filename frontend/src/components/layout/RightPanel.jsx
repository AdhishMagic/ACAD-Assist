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
          className="sticky right-0 top-16 z-10 hidden h-[calc(100vh-4rem)] flex-shrink-0 flex-col overflow-hidden border-l border-gray-200 bg-white lg:flex dark:border-border dark:bg-surface-secondary"
        >
          <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-border">
            <div className="flex items-center space-x-2 font-medium text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>AI Assistant Context</span>
            </div>
            <button 
              onClick={closePanel}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Suggestions */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Suggestions</h3>
              <div className="space-y-2">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-gray-700 dark:border-indigo-800/40 dark:bg-indigo-950/30 dark:text-gray-200">
                  <span className="font-medium text-indigo-700 dark:text-indigo-400">Pro tip:</span> Generate a quick quiz from your latest notes to reinforce learning.
                </div>
              </div>
            </div>

            {/* Recent Notes */}
            <div>
              <h3 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <BookMarked className="h-3 w-3 mr-1" /> Related Materials
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start cursor-pointer group">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">Neural Networks Basics</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Updated 2h ago</p>
                  </div>
                </li>
                <li className="flex items-start cursor-pointer group">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">Data Structures Midterm</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generated yesterday</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Activity */}
            <div>
              <h3 className="mb-3 flex items-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                <Clock className="h-3 w-3 mr-1" /> Recent Activity
              </h3>
              <div className="relative ml-2 space-y-4 border-l border-gray-200 pb-4 dark:border-border">
                <div className="relative pl-4">
                  <div className="absolute -left-1.5 top-1.5 h-2.5 w-2.5 rounded-full border border-white bg-gray-200 dark:border-surface-secondary dark:bg-border"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-200">Reviewed <span className="font-medium">OS Chapter 4</span></p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">10:30 AM</span>
                </div>
                <div className="relative pl-4">
                  <div className="absolute -left-1.5 top-1.5 h-2.5 w-2.5 rounded-full border border-white bg-gray-200 dark:border-surface-secondary dark:bg-border"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-200">Created new study guide</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Yesterday</span>
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
