import React from 'react';
import { SettingsCard } from './SettingsCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '../hooks/useSettings';
import { Mail, BellRing, FileCheck, Sparkles } from 'lucide-react';

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = (key, checked) => {
    updateSettings({ notifications: { ...settings?.notifications, [key]: checked } });
  };

  const notificationOptions = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive daily summaries and important alerts via email.',
      icon: Mail,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'system',
      title: 'System Notifications',
      description: 'In-app push notifications for platform updates.',
      icon: BellRing,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'testResults',
      title: 'Test Result Alerts',
      description: 'Get notified when your AI generated question paper results are ready.',
      icon: FileCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      id: 'aiResponses',
      title: 'AI Response Alerts',
      description: 'Alerts when the AI assistant completes long autonomous study tasks.',
      icon: Sparkles,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <SettingsCard title="Notification Preferences" description="Manage how and when you receive notifications from the platform." delay={0.1}>
        <div className="space-y-4">
          {notificationOptions.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <div key={opt.id} className="flex items-start sm:items-center justify-between p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all">
                <div className="flex items-start gap-4 mr-4 sm:mr-0">
                  <div className={`p-2 rounded-lg ${opt.bg} ${opt.color} shrink-0 mt-1 sm:mt-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={opt.id} className="text-base font-semibold cursor-pointer">
                      {opt.title}
                    </Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  <Switch
                    id={opt.id}
                    checked={settings?.notifications?.[opt.id] !== false}
                    onCheckedChange={(c) => handleToggle(opt.id, c)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SettingsCard>
    </div>
  );
}
