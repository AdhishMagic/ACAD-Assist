import { Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const themeOptions = [
  { id: "light", icon: Sun, label: "Light Mode", desc: "Clean and bright" },
  { id: "dark", icon: Moon, label: "Dark Mode", desc: "Easy on the eyes" },
  { id: "system", icon: Monitor, label: "System", desc: "Syncs with your OS" },
];

export function ThemeToggle({ value, onChange }) {
  const handleClick = (id) => {
    console.log("🖱️ Theme button clicked:", id);
    onChange(id);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {themeOptions.map(({ id, icon: Icon, label, desc }) => {
        const isActive = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            aria-pressed={isActive}
            className={cn(
              "relative flex flex-col items-start p-5 rounded-xl border-2 transition-all text-left",
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/50 hover:bg-muted/50 bg-card"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className={cn("h-6 w-6 mb-4", isActive ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("font-semibold", isActive ? "text-primary" : "text-foreground")}>{label}</span>
            <span className="text-xs text-muted-foreground mt-1">{desc}</span>
          </button>
        );
      })}
    </div>
  );
}
