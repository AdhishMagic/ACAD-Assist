import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles } from "lucide-react";
import ChatToolbar from "./ChatToolbar";

export default function ChatMessage({ message, onSaveNote }) {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 p-5 rounded-2xl ${
        isAI 
          ? "bg-card border shadow-sm" 
          : "bg-transparent mx-4"
      }`}
    >
      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
        isAI ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : 'bg-muted text-muted-foreground'
      }`}>
        {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        <div className="font-semibold text-sm flex items-center gap-2">
          {isAI ? (
            <>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">AI Assistant</span>
            </>
          ) : "You"}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border">
          {isAI ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          )}
        </div>
        {isAI && <ChatToolbar message={message} onSaveNote={onSaveNote} />}
      </div>
    </motion.div>
  );
}
