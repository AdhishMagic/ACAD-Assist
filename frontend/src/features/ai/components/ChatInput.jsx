import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUp, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || isLoading) return;
    onSendMessage(input, files);
    setInput("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {files.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
            >
              <Paperclip className="h-3 w-3 text-[var(--text-tertiary)]" />
              <span className="max-w-[140px] truncate">{file.name}</span>
              <button onClick={() => removeFile(i)} className="ml-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div 
        {...getRootProps()} 
        className={`rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] px-3 py-2.5 shadow-[0_12px_32px_rgba(37,99,235,0.08)] transition-all ${
          isDragActive ? "border-[var(--accent-solid)] bg-[var(--bg-card-hover)]" : ""
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-muted)] hover:text-[var(--text-primary)]"
            onClick={open}
          >
            <Paperclip className="h-4.5 w-4.5" />
          </Button>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDragActive ? "Drop files here..." : "Ask anything about your studies..."}
            className="min-h-[44px] max-h-[200px] flex-1 resize-none rounded-xl border border-transparent bg-[var(--bg-card-muted)] px-4 py-2.5 text-[15px] leading-6 text-[var(--text-primary)] shadow-none focus-visible:border-[var(--accent-solid)]/20 focus-visible:ring-0"
            rows={1}
          />

          <Button 
            onClick={handleSend} 
            disabled={(!input.trim() && files.length === 0) || isLoading}
            size="icon"
            className={`h-9 w-9 shrink-0 rounded-full transition-all ${
              (!input.trim() && files.length === 0)
                ? "bg-[var(--bg-card-muted)] text-[var(--text-tertiary)]"
                : "bg-[var(--accent-solid)] text-[var(--accent-contrast)] shadow-[0_6px_18px_rgba(37,99,235,0.28)] hover:scale-[1.02] hover:opacity-95"
            }`}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2.5 text-center">
        <p className="text-[11px] tracking-[0.01em] text-[var(--text-tertiary)]">AI can make mistakes. Verify important information.</p>
      </div>
    </div>
  );
}
