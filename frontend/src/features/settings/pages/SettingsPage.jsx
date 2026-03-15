import React, { useState } from 'react';
import { SettingsSidebar } from '../components/SettingsSidebar';
import { AccountSettings } from '../components/AccountSettings';
import { SecuritySettings } from '../components/SecuritySettings';
import { NotificationSettings } from '../components/NotificationSettings';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { SETTINGS_TABS } from '../constants/settingsTabs';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-6xl min-h-[calc(100vh-4rem)]">
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={SETTINGS_TABS} />
      </aside>
      
      <main className="flex-1 min-w-0 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
