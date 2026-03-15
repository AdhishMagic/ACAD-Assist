import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

export default function ChatSidebar({ history, onSelectChat, onNewChat }) {
  return (
    <div className="w-64 border-r bg-card flex flex-col h-full hidden md:flex">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full flex items-center gap-2 font-medium">
          <Plus className="w-4 h-4" /> New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {history?.length > 0 ? (
          history.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent text-sm text-left group transition-all"
            >
              <MessageSquare className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate flex-1 font-medium">{chat.title || "New Conversation"}</span>
              <Trash2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity shrink-0" />
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No history yet</p>
        )}
      </div>
    </div>
  );
}
