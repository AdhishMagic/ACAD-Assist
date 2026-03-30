import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Navbar, 
  Sidebar, 
  RightPanel 
} from '../../components/layout';
import { CommandPalette } from '@/features/system/components/CommandPalette';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const applyTheme = useCallback((themeMode) => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const shouldUseDark = themeMode === 'dark' || (themeMode === 'system' && media.matches);
    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDarkMode(shouldUseDark);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme') || 'system';
    applyTheme(storedTheme);

    const handleSystemThemeChange = () => {
      const currentTheme = localStorage.getItem('theme') || 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    const handleStorageThemeChange = (event) => {
      if (event.key === 'theme') {
        applyTheme(event.newValue || 'system');
      }
    };

    const handleCustomThemeChange = (event) => {
      const nextTheme = event?.detail?.theme || localStorage.getItem('theme') || 'system';
      applyTheme(nextTheme);
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleSystemThemeChange);
    } else {
      media.addListener(handleSystemThemeChange);
    }

    window.addEventListener('storage', handleStorageThemeChange);
    window.addEventListener('theme-change', handleCustomThemeChange);

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleSystemThemeChange);
      } else {
        media.removeListener(handleSystemThemeChange);
      }
      window.removeEventListener('storage', handleStorageThemeChange);
      window.removeEventListener('theme-change', handleCustomThemeChange);
    };
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    const currentTheme = localStorage.getItem('theme') || 'system';
    const isCurrentlyDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: nextTheme } }));
  }, [applyTheme]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-950 overflow-hidden font-sans text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <CommandPalette />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
        <Navbar 
          toggleSidebar={() => setIsMobileSidebarOpen(true)}
          toggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          isDark={isDarkMode}
          toggleTheme={toggleTheme}
        />
        
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          <main className="flex-1 min-h-0 overflow-y-auto focus:outline-none bg-gray-50/50 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 min-h-full">
              {/* React Router Outlet renders child routes here */}
              <Outlet />
            </div>
          </main>
          
          <RightPanel 
            isOpen={isRightPanelOpen} 
            closePanel={() => setIsRightPanelOpen(false)} 
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
