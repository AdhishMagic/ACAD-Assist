import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function ChatSidebar({ history, activeChatId, onSelectChat, onNewChat, onDeleteChat, onRenameChat }) {
  return (
    <aside className="chat-theme-sidebar hidden h-full w-64 flex-col px-3 py-4 md:flex">
      <div className="pb-4">
        <Button
          onClick={onNewChat}
          className="h-11 w-full justify-start rounded-xl bg-[var(--accent-solid)] px-4 text-sm font-medium text-[var(--accent-contrast)] hover:opacity-95"
        >
          <Plus className="w-4 h-4" /> New Chat
        </Button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {history?.length > 0 ? (
          history.map((chat) => (
            <div
              key={chat.id}
              className={`group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                activeChatId === chat.id
                  ? "chat-theme-accent-surface text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className="min-w-0 flex-1"
              >
                <span className="block min-w-0">
                  <span className="block truncate font-medium">{chat.title || "New Conversation"}</span>
                  {chat.preview && (
                    <span className={`mt-1 block truncate text-xs ${activeChatId === chat.id ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"}`}>
                      {chat.preview}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                title="Rename conversation"
                className="shrink-0 text-[var(--text-tertiary)] opacity-0 transition-opacity hover:text-[var(--text-primary)] group-hover:opacity-100"
                onClick={() => onRenameChat?.(chat)}
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                type="button"
                title="Delete conversation"
                className="shrink-0 text-[var(--text-tertiary)] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                onClick={() => onDeleteChat?.(chat)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-[var(--text-tertiary)]">No history yet</p>
        )}
      </div>
    </aside>
  );
}
