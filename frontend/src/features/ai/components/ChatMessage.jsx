import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatToolbar from "./ChatToolbar";

export default function ChatMessage({ message, onSaveNote, onLikeFeedback }) {
  const isAI = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div className={`w-full max-w-[85%] ${isAI ? "space-y-3" : "space-y-2"}`}>
        <div className={`text-xs font-medium uppercase tracking-[0.16em] ${isAI ? "text-[var(--text-tertiary)]" : "text-right text-[var(--text-tertiary)]"}`}>
          {isAI ? "Assistant" : "You"}
        </div>

        <div
          className={
            isAI
              ? "text-base leading-7 text-[var(--text-primary)]"
              : "ml-auto w-fit max-w-full rounded-2xl px-4 py-3 text-base leading-7 text-[var(--accent-contrast)] shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
          }
          style={isAI ? undefined : { background: "var(--accent-solid)" }}
        >
          {isAI ? (
            <div className="max-w-none text-base leading-7 [&_a]:text-[var(--accent-solid)] [&_code]:rounded [&_code]:bg-[var(--bg-card-muted)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.95em] [&_code]:text-[var(--text-primary)] [&_h1]:mb-3 [&_h1]:mt-0 [&_h1]:text-[var(--text-primary)] [&_h2]:mb-3 [&_h2]:mt-0 [&_h2]:text-[var(--text-primary)] [&_h3]:mb-2 [&_h3]:mt-0 [&_h3]:text-[var(--text-primary)] [&_li]:text-[var(--text-primary)] [&_ol]:my-3 [&_ol]:pl-5 [&_p]:my-0 [&_p]:leading-7 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-[var(--border-soft)] [&_pre]:bg-[var(--bg-card)] [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:text-[var(--text-primary)] [&_ul]:my-3 [&_ul]:pl-5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {Array.isArray(message.files) && message.files.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isAI ? "" : "justify-end"}`}>
            {message.files.map((file) => (
              <span key={file} className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                {file}
              </span>
            ))}
          </div>
        )}

        {isAI && <ChatToolbar message={message} onSaveNote={onSaveNote} onLikeFeedback={onLikeFeedback} />}
      </div>
    </motion.div>
  );
}
