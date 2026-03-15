import React, { useState } from 'react';
import { SettingsCard } from './SettingsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '../hooks/useSettings';
import { Smartphone, Monitor, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';

export function SecuritySettings() {
  const { updatePassword, isUpdatingPassword, settings, updateSettings } = useSettings();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return;
    await updatePassword({
      current: passwords.currentPassword,
      new: passwords.newPassword,
    });
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Update Password" description="Ensure your account is using a long, random password to stay secure." delay={0.1}>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative max-w-md">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} onChange={handleChange} className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative max-w-md">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} onChange={handleChange} className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative max-w-md">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleChange} className="pl-9" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isUpdatingPassword || !passwords.newPassword} className="w-full sm:w-auto">
              {isUpdatingPassword ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
              ) : "Update Password"}
            </Button>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard title="Two-Factor Authentication" description="Add additional security to your account using two-factor authentication." delay={0.2}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-xl p-4 sm:p-6 bg-card hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">Receive a code via SMS or Authenticator App.</p>
            </div>
          </div>
          <Switch 
            checked={settings?.twoFactorEnabled} 
            onCheckedChange={(checked) => updateSettings({ twoFactorEnabled: checked })}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Active Sessions" description="Manage and log out of your active sessions on other browsers and devices." delay={0.3}>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-md text-foreground">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Windows PC • Chrome</p>
                <p className="text-xs text-muted-foreground mt-0.5">Active Now • 192.168.1.1</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled className="text-xs">Current Default</Button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-md text-foreground">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">iPhone 13 • Safari</p>
                <p className="text-xs text-muted-foreground mt-0.5">Last active 2 hrs ago • 10.0.0.5</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-white transition-colors text-xs">Revoke</Button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
