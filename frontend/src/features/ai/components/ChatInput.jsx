import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Paperclip, Send, X } from "lucide-react";
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
    <div className="relative w-full max-w-4xl mx-auto">
      {/* File Preview */}
      {files.length > 0 && (
        <div className="flex gap-2 p-2 overflow-x-auto mb-2 bg-card border rounded-lg shadow-sm">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-xs border shrink-0">
              <Paperclip className="w-3 h-3 text-primary" />
              <span className="truncate max-w-[120px] font-medium">{file.name}</span>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div 
        {...getRootProps()} 
        className={`flex items-end gap-2 p-3 border rounded-2xl bg-card shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 overflow-hidden ${isDragActive ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="mb-1">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-10 w-10 transition-colors"
            onClick={open}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDragActive ? "Drop files here..." : "Ask a question about your studies..."}
          className="min-h-[44px] max-h-[200px] border-0 focus-visible:ring-0 resize-none bg-transparent p-3 shadow-none overflow-y-auto text-base"
          rows={1}
        />

        <div className="mb-1">
          <Button 
            onClick={handleSend} 
            disabled={(!input.trim() && files.length === 0) || isLoading}
            size="icon"
            className={`shrink-0 rounded-full h-10 w-10 transition-all ${
              (!input.trim() && files.length === 0) ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:scale-105 shadow-md'
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-[11px] text-muted-foreground">AI can make mistakes. Verify important information.</p>
      </div>
    </div>
  );
}
