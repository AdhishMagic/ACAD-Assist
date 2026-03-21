import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const MOCK_GENERATED = [
  { id: 'gen-1', title: 'Operating Systems - Process Scheduling', createdAt: 'Today' },
  { id: 'gen-2', title: 'Computer Networks - Network Layers', createdAt: 'Yesterday' },
  { id: 'gen-3', title: 'DBMS - Normalization Summary', createdAt: '2 days ago' },
];

export default function GeneratedNotesLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Generated Notes</h1>
        <p className="text-muted-foreground mt-1">Open any generated note to view and download.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_GENERATED.map((note) => (
          <Link key={note.id} to={`/student/ai/generated/${note.id}`} className="block">
            <Card className="hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Created: {note.createdAt}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
