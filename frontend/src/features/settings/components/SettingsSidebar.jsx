import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function SettingsSidebar({ activeTab, onTabChange, tabs }) {
  return (
    <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-full justify-start relative px-4 py-2 hover:bg-transparent tracking-wide transition-colors",
              isActive ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-primary/10 rounded-md -z-10 border border-primary/20"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="mr-3 h-5 w-5 shrink-0" />
            <span className="font-semibold">{tab.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
