import { Sparkles } from "lucide-react";

export default function AIResponseCard({ title, children, className = "" }) {
  return (
    <div className={`bg-card border rounded-xl overflow-hidden shadow-sm my-4 transition-all hover:shadow-md ${className}`}>
      {title && (
        <div className="bg-primary/5 px-4 py-3 border-b flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground/90">{title}</h3>
        </div>
      )}
      <div className="p-4 md:p-5">
        {children}
      </div>
    </div>
  );
}
