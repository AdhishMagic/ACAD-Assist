import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Navbar,
  Sidebar,
  RightPanel,
} from '../../components/layout';
import { CommandPalette } from '@/features/system/components/CommandPalette';
import { useTheme } from '@/app/providers';

const DESKTOP_SIDEBAR_EXPANDED_WIDTH = 264;
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 72;

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-background font-sans text-slate-900 transition-colors duration-200 dark:text-slate-50">
      <CommandPalette />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className="hidden flex-shrink-0 lg:block"
        style={{ width: isSidebarCollapsed ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH : DESKTOP_SIDEBAR_EXPANDED_WIDTH }}
        aria-hidden="true"
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setIsMobileSidebarOpen(true)}
          toggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
          isDark={resolvedTheme === 'dark'}
          toggleTheme={toggleTheme}
        />

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <main className="flex-1 min-h-0 w-full overflow-x-hidden overflow-y-auto bg-gray-50/50 focus:outline-none dark:bg-gray-950">
            <div className="page-shell page-section min-h-full">
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
