import { useMemo, useState } from "react";
import { Download, Share2, Copy, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CitationBlock from "./CitationBlock";
import { motion } from "framer-motion";
import { downloadNoteAsPdf } from "@/features/notes/utils/noteActions";
import { useAISaveNote } from "../hooks/useAIChat";

export default function GeneratedNoteViewer({ note }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveNoteMutation = useAISaveNote();

  const printableContent = useMemo(() => {
    if (!note) return '';
    const lines = [];
    lines.push(`# ${note.title || 'AI Generated Note'}`);
    if (note.topic) lines.push(`**Topic:** ${note.topic}`);
    if (note.summary) {
      lines.push('');
      lines.push(note.summary);
    }

    if (note.definitions?.length) {
      lines.push('');
      lines.push('## Key Definitions');
      for (const def of note.definitions) {
        lines.push(`- **${def.term}**: ${def.definition}`);
      }
    }

    if (note.explanations) {
      lines.push('');
      lines.push('## Detailed Explanation');
      lines.push(note.explanations);
    }

    if (note.examples?.length) {
      lines.push('');
      lines.push('## Examples');
      for (const ex of note.examples) lines.push(`- ${ex}`);
    }

    if (note.practiceQuestions?.length) {
      lines.push('');
      lines.push('## Practice Questions');
      note.practiceQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    }

    if (note.citations?.length) {
      lines.push('');
      lines.push('## Citations');
      for (const c of note.citations) {
        lines.push(`- ${c.title}${c.author ? ` — ${c.author}` : ''}${c.link ? ` (${c.link})` : ''}`);
      }
    }

    return lines.join('\n');
  }, [note]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = () => {
    const exportNote = {
      id: note.id,
      title: note.title,
      subject: note.topic,
      author: 'AI Assistant',
      createdAt: note.dateSaved || note.createdAt || new Date().toISOString(),
      content: printableContent,
      excerpt: note.summary,
    };
    downloadNoteAsPdf(exportNote);
  };

  const handleShare = async () => {
    const url = window.location?.href || `${window.location.origin}/student/ai/generated/${note.id}`;
    const shareData = {
      title: note.title || 'AI Generated Note',
      text: note.summary || '',
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (e) {
      // user cancelled share; no-op
    }
  };

  const handleSave = async () => {
    try {
      await saveNoteMutation.mutateAsync({
        title: note.title || 'AI Generated Note',
        topic: note.topic || 'AI',
        content: printableContent,
        preview: (note.summary || printableContent).toString().substring(0, 110) + '...',
        dateSaved: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      // handled by caller console/logging; keep UI stable
    }
  };

  if (!note) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto bg-card rounded-xl border shadow-sm mt-2 mb-12"
    >
      {/* Header Info */}
      <div className="p-6 md:p-8 border-b bg-muted/10 rounded-t-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-primary/20">
              {note.topic}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{note.title}</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy} className="bg-background">
              {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" className="bg-background hidden sm:flex" onClick={handleExportPdf}>
              <Download className="w-4 h-4 mr-2" /> Export PDF
            </Button>
            <Button variant="outline" size="sm" className="bg-background hidden sm:flex" onClick={handleShare}>
              {shared ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Share2 className="w-4 h-4 mr-2" />}
              {shared ? (navigator.share ? 'Shared' : 'Link Copied') : 'Share'}
            </Button>
            <Button size="sm" className="shadow-sm" onClick={handleSave} disabled={saveNoteMutation.isPending}>
              {saved ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Bookmark className="w-4 h-4 mr-2" />}
              {saveNoteMutation.isPending ? 'Saving...' : (saved ? 'Saved' : 'Save Form')}
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{note.summary}</p>
      </div>

      <div className="p-6 md:p-8 space-y-10">
        {/* Definitions */}
        {note.definitions && note.definitions.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-5 text-foreground/90 border-b pb-2 flex items-center">
              <span className="bg-primary/10 w-8 h-8 rounded-md flex items-center justify-center mr-3 text-primary text-sm">Dt</span>
              Key Definitions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {note.definitions.map((def, i) => (
                <div key={i} className="bg-muted/30 p-5 rounded-lg border hover:border-primary/20 transition-colors">
                  <h4 className="font-semibold text-primary mb-2 text-base">{def.term}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{def.definition}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explanations */}
        {note.explanations && (
          <section>
            <h2 className="text-xl font-semibold mb-5 text-foreground/90 border-b pb-2">Detailed Explanation</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{note.explanations}</p>
            </div>
          </section>
        )}

        {/* Examples */}
        {note.examples && note.examples.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-5 text-foreground/90 border-b pb-2">Examples</h2>
            <ul className="grid gap-3">
              {note.examples.map((ex, i) => (
                <li key={i} className="flex gap-3 bg-card border rounded-lg p-4 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-muted-foreground text-sm leading-relaxed">{ex}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Practice Questions */}
        {note.practiceQuestions && note.practiceQuestions.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-5 text-foreground/90 border-b pb-2">Practice Questions</h2>
            <div className="space-y-3">
              {note.practiceQuestions.map((q, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-primary/5 rounded-lg border border-primary/10 hover:bg-primary/10 transition-colors">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-background border shadow-sm text-sm font-medium text-primary shrink-0 transition-transform hover:scale-110">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium pt-1 text-foreground/90">{q}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Citations */}
        <CitationBlock citations={note.citations} />
      </div>
    </motion.div>
  );
}
