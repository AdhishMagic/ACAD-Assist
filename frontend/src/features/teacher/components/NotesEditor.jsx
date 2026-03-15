import React from 'react';
import { Textarea } from '@/components/ui/textarea';

const NotesEditor = ({ content, setContent }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 dark:bg-gray-800/50 p-2 flex gap-2 border-b border-gray-200 dark:border-gray-800 rounded-t-lg">
        {/* Simple markdown toolbar mock */}
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-bold" title="Bold">B</button>
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 italic" title="Italic">I</button>
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 underline" title="Underline">U</button>
        <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1 my-1"></div>
        <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 font-mono text-sm" title="Code">{'</>'}</button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your notes here..."
        className="flex-1 resize-none border-0 focus-visible:ring-0 bg-transparent p-4 font-mono text-sm rounded-none rounded-b-lg shadow-none"
      />
    </div>
  );
};

export default NotesEditor;
