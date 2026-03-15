import React from 'react';

const NotesPreview = ({ content }) => {
  // A very basic markdown-to-html renderer mock for preview purposes
  const renderMarkdown = (text) => {
    if (!text) return '<p class="text-gray-400 italic">Preview will appear here...</p>';
    
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 text-pink-500 rounded px-1 py-0.5 font-mono text-sm">$1</code>')
      .replace(/\n$/gim, '<br />')
      .replace(/([^>]+)(\n|$)/gim, '<p class="mb-2 leading-relaxed">$1</p>');
  };

  return (
    <div className="h-full bg-white dark:bg-gray-950 p-6 overflow-y-auto prose prose-sm sm:prose-base dark:prose-invert max-w-none border-l border-gray-200 dark:border-gray-800">
      <div 
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} 
        className="text-gray-800 dark:text-gray-200"
      />
    </div>
  );
};

export default NotesPreview;
