import React from 'react';
import { SettingsCard } from './SettingsCard';
import { Label } from '@/components/ui/label';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '@/app/providers';
import { ThemeToggle } from './ThemeToggle';

export function AppearanceSettings() {
  const { updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (nextTheme) => {
    console.log("🎨 Theme button clicked in UI:", nextTheme);
    setTheme(nextTheme);
    
    // Sync to backend settings without blocking UI
    updateSettings({
      appearance: { theme: nextTheme },
      theme: nextTheme,
    }).catch((err) => {
      console.error("⚠️ Failed to sync theme to backend:", err);
    });
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Appearance" description="Customize the look and feel of your ACAD-Assist dashboard." delay={0.1}>
        <div className="space-y-4">
          <Label className="text-base font-semibold">Interface Theme</Label>
          <ThemeToggle value={theme} onChange={handleThemeChange} />
        </div>
      </SettingsCard>
    </div>
  );
}
