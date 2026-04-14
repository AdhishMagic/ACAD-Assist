import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GeneratedNotesLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Generated Notes</h1>
        <p className="text-muted-foreground mt-1">Open any generated note to view and download.</p>
      </div>

      <Alert>
        <AlertDescription>
          No generated notes available. This feature requires backend API implementation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
