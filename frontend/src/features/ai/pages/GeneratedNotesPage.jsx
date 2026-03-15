import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GeneratedNoteViewer from "../components/GeneratedNoteViewer";
import { useAIGeneratedNote } from "../hooks/useAIChat";

export default function GeneratedNotesPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { data: note, isLoading, isError } = useAIGeneratedNote(noteId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mb-6 group hover:bg-muted/50 rounded-full pl-3 pr-5 h-9"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </Button>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-6" />
          <p className="text-muted-foreground text-lg font-medium animate-pulse">Structuring generated note...</p>
        </div>
      ) : isError || !note ? (
        <div className="text-center py-32 bg-destructive/5 rounded-3xl border border-destructive/20 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="text-3xl font-bold mb-3">Note Not Found</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">The study note and generated content you're looking for doesn't exist or has been removed.</p>
          <Button size="lg" onClick={() => navigate('/ai/saved-notes')} className="rounded-full">
            Return to Saved Notes
          </Button>
        </div>
      ) : (
        <GeneratedNoteViewer note={note} />
      )}
    </div>
  );
}
