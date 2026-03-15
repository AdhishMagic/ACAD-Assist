import { Button } from "@/components/ui/button";
import { Copy, BookmarkPlus, ThumbsUp } from "lucide-react";

export default function ChatToolbar({ message, onSaveNote }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className="flex items-center gap-2 pt-3 opacity-80 hover:opacity-100 transition-opacity">
      <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-full bg-background/50 hover:bg-accent" onClick={handleCopy}>
        <Copy className="w-3 h-3 mr-1.5" /> Copy
      </Button>
      <Button variant="outline" size="sm" className="h-8 px-3 text-xs rounded-full bg-background/50 hover:bg-accent" onClick={() => onSaveNote(message)}>
        <BookmarkPlus className="w-3 h-3 mr-1.5" /> Save as Note
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
        <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
