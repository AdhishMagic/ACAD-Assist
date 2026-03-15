import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

export default function PromptSuggestions({ onSelect }) {
  const suggestions = [
    "Explain this topic",
    "Generate summary",
    "Create quiz questions",
    "Give examples",
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {suggestions.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-medium bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
          onClick={() => onSelect(prompt)}
        >
          <Lightbulb className="w-3.5 h-3.5 mr-2 text-amber-500" />
          {prompt}
        </Button>
      ))}
    </div>
  );
}
