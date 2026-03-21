import React, { useState } from 'react';
import NotesEditor from '../components/NotesEditor';

export default function NotesEditorPage() {
  const [content, setContent] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notes Editor</h1>
        <p className="text-muted-foreground mt-1">Write and format notes for your students.</p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <NotesEditor content={content} setContent={setContent} />
      </div>
    </div>
  );
}
