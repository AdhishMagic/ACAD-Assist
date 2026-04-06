import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Navbar, 
  Sidebar, 
  RightPanel 
} from '../../components/layout';
import { CommandPalette } from '@/features/system/components/CommandPalette';
import { useTheme } from '@/app/providers';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  console.log("📊 DashboardLayout - Current resolvedTheme:", resolvedTheme);

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
          isDark={resolvedTheme === 'dark'}
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
