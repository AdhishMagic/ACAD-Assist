import { BookOpen, ExternalLink } from "lucide-react";

export default function CitationBlock({ citations }) {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border bg-muted/40 p-5 shadow-sm">
      <h4 className="text-sm font-semibold flex items-center gap-2 mb-4 text-foreground/80">
        <BookOpen className="w-4 h-4 text-primary" />
        Sources & References
      </h4>
      <ul className="space-y-3">
        {citations.map((citation, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
            <span className="text-primary font-medium mt-0.5">[{index + 1}]</span>
            <div className="flex-1">
              <span className="font-medium text-foreground block md:inline">{citation.title}</span>
              {citation.author && <span className="text-muted-foreground/80 md:ml-1">— {citation.author}</span>}
              {citation.link && citation.link !== '#' && (
                <a 
                  href={citation.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center md:ml-2 text-primary hover:text-primary/80 hover:underline transition-colors mt-1 md:mt-0"
                >
                  Link <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
