import React, { useState, useEffect } from 'react';
import { SettingsCard } from './SettingsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSettings } from '../hooks/useSettings';
import { Upload, Loader2 } from 'lucide-react';

export function AccountSettings() {
  const { settings, updateSettings, isUpdating } = useSettings();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        fullName: settings.fullName || '',
        email: settings.email || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  return (
    <div className="space-y-6">
      <SettingsCard title="Profile Information" description="Update your account's profile information and email address." delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24 border-2 border-border shadow-sm">
              <AvatarImage src={settings?.avatarUrl} alt="Avatar" />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {formData.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" type="button" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload New Image
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommend size: 256x256px. Max 2MB.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="max-w-md"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="max-w-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </SettingsCard>
    </div>
  );
}
