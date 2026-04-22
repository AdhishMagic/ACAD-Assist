import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Download,
  FileText,
  Loader2,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyNotes } from '@/features/notes/hooks/useNotes';
import { downloadNoteAsPdf } from '@/features/notes/utils/noteActions';

const GENERATED_HINTS = ['ai', 'generated', 'assistant', 'summary', 'quiz', 'concept'];

const dateLabel = (value) => {
  if (!value) return 'Recently';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const wordCount = (content = '') => String(content).trim().split(/\s+/).filter(Boolean).length;

const isGeneratedNote = (note) => {
  const searchable = [
    note.title,
    note.type,
    note.subject,
    note.author,
    ...(note.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return GENERATED_HINTS.some((hint) => searchable.includes(hint));
};

const getPreview = (note) => {
  const source = note.excerpt || note.content || '';
  if (source.length <= 170) return source;
  return `${source.slice(0, 167).trim()}...`;
};

export default function GeneratedNotesLibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const { data, isLoading, isError } = useMyNotes({ sort: 'newest' });

  const generatedNotes = useMemo(() => {
    const notes = data?.notes || [];
    const hinted = notes.filter(isGeneratedNote);
    return hinted.length > 0 ? hinted : notes;
  }, [data]);

  const subjects = useMemo(() => {
    return Array.from(new Set(generatedNotes.map((note) => note.subject || 'General'))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [generatedNotes]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const nextNotes = generatedNotes.filter((note) => {
      const matchesSearch = !query || [note.title, note.subject, note.content, ...(note.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query);
      const matchesSubject = subjectFilter === 'all' || (note.subject || 'General') === subjectFilter;
      return matchesSearch && matchesSubject;
    });

    return nextNotes.sort((a, b) => {
      if (sortMode === 'title') return (a.title || '').localeCompare(b.title || '');
      const aDate = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return sortMode === 'oldest' ? aDate - bDate : bDate - aDate;
    });
  }, [generatedNotes, searchQuery, subjectFilter, sortMode]);

  const stats = useMemo(() => {
    const totalWords = generatedNotes.reduce((sum, note) => sum + wordCount(note.content), 0);
    const bookmarked = generatedNotes.filter((note) => note.isBookmarked).length;
    return [
      { label: 'Generated Notes', value: generatedNotes.length },
      { label: 'Subjects', value: subjects.length },
      { label: 'Saved', value: bookmarked },
      { label: 'Words', value: totalWords.toLocaleString() },
    ];
  }, [generatedNotes, subjects.length]);

  const openNote = (noteId) => navigate(`/student/ai/generated/${noteId}`);

  const exportNote = (note) => {
    downloadNoteAsPdf({
      id: note.id,
      title: note.title,
      subject: note.subject,
      author: note.author || 'AI Assistant',
      createdAt: note.createdAt,
      content: note.content || note.excerpt || '',
      excerpt: note.excerpt,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Badge className="mb-3 bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 hover:bg-indigo-500/10">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            AI Notes Library
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Generated Notes</h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Review generated study material, open full notes, and export polished PDFs.
          </p>
        </div>
        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/student/ai')}>
          <Bot className="mr-2 h-4 w-4" />
          Generate Notes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border bg-card/70 p-4">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card/70 p-3">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search generated notes..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 pl-9"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortMode} onValueChange={setSortMode}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed">
          <Loader2 className="h-9 w-9 animate-spin text-indigo-400" />
          <p className="mt-4 text-sm text-muted-foreground">Loading generated notes...</p>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="text-lg font-semibold text-red-300">Unable to load generated notes</h2>
          <p className="mt-1 text-sm text-muted-foreground">Please check the backend connection and try again.</p>
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredNotes.map((note) => (
            <article key={note.id} className="flex min-h-[250px] flex-col rounded-lg border bg-card/80 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="secondary" className="mb-3 max-w-full truncate">
                    {note.subject || 'General'}
                  </Badge>
                  <h2 className="line-clamp-2 text-lg font-semibold leading-snug">{note.title}</h2>
                </div>
                <div className="rounded-md bg-indigo-500/10 p-2 text-indigo-300">
                  <Wand2 className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">{getPreview(note)}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(note.tags || []).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-5">
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{wordCount(note.content).toLocaleString()} words</span>
                  <span>{dateLabel(note.updatedAt || note.createdAt)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Button onClick={() => openNote(note.id)} className="bg-indigo-600 hover:bg-indigo-700">
                    Open Note
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => exportNote(note)} title="Download PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center">
          <div className="rounded-lg border bg-card p-4">
            <FileText className="h-9 w-9 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">No generated notes found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {searchQuery || subjectFilter !== 'all'
              ? 'Try a different search or filter.'
              : 'Create a note from AI Study Assistant and it will appear here.'}
          </p>
          <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/student/ai')}>
            <Sparkles className="mr-2 h-4 w-4" />
            Start with AI
          </Button>
        </div>
      )}
    </div>
  );
}
