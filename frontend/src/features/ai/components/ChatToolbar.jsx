import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, BookmarkPlus, ThumbsUp } from "lucide-react";

export default function ChatToolbar({ message, onSaveNote, onLikeFeedback }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(Boolean(message?.feedback?.reaction === 'like'));
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const handleCopy = () => {
    const text = String(message?.content || "");
    if (!text) return;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleLike = async () => {
    if (!message?.query_id || liked || isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);
    try {
      await onLikeFeedback?.(message, 'like');
      setLiked(true);
    } finally {
      setIsSendingFeedback(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 opacity-80 hover:opacity-100 transition-opacity">
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2 sm:px-3 text-xs rounded-full bg-background/50 hover:bg-accent"
        onClick={handleCopy}
        aria-label="Copy assistant response"
      >
        <Copy className="w-3 h-3 sm:mr-1.5" />
        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-2 sm:px-3 text-xs rounded-full bg-background/50 hover:bg-accent"
        onClick={() => onSaveNote(message)}
        aria-label="Save response as note"
      >
        <BookmarkPlus className="w-3 h-3 sm:mr-1.5" />
        <span className="hidden sm:inline">Save as Note</span>
      </Button>
      <Button
        variant={liked ? "default" : "ghost"}
        size="sm"
        className={`h-8 w-8 p-0 rounded-full ${liked ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
        onClick={handleLike}
        disabled={liked || isSendingFeedback}
        aria-label="Like response"
        title={liked ? 'Feedback sent' : 'Send like feedback to RAG'}
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      </Button>
    </div>
  );
}
