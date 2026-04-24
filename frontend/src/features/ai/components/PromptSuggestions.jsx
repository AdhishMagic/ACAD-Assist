import { Button } from "@/components/ui/button";

export default function PromptSuggestions({ onSelect }) {
  const suggestions = [
    "Explain this topic",
    "Generate summary",
    "Create quiz questions",
    "Give examples",
  ];

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {suggestions.map((prompt, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] shadow-[0_4px_14px_rgba(37,99,235,0.04)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
}
