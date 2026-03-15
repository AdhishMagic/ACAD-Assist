import React from 'react';
import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { useSettings } from '../hooks/useSettings';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();
  
  const currentTheme = settings?.theme || 'system';

  const handleThemeChange = (theme) => {
    updateSettings({ theme });
    // Side effect: update document body class or theme provider
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else if (theme === 'light') document.documentElement.classList.remove('dark');
  };

  const themes = [
    { id: 'light', icon: Sun, label: 'Light Mode', desc: 'Clean and bright' },
    { id: 'dark', icon: Moon, label: 'Dark Mode', desc: 'Easy on the eyes' },
    { id: 'system', icon: Monitor, label: 'System', desc: 'Syncs with your OS' },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Appearance" description="Customize the look and feel of your ACAD-Assist dashboard." delay={0.1}>
        <div className="space-y-4">
          <Label className="text-base font-semibold">Interface Theme</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {themes.map(({ id, icon: Icon, label, desc }) => {
              const isActive = currentTheme === id;
              return (
                <button
                  key={id}
                  onClick={() => handleThemeChange(id)}
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
        </div>
      </SettingsCard>
    </div>
  );
}
