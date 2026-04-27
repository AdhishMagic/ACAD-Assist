import React from 'react';
import { Menu, Bell, Moon, Sun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/features/auth/store/authSlice';
import { useNotificationSummary } from '@/features/system/hooks/useNotifications';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Navbar = ({ toggleSidebar, toggleRightPanel, isDark, toggleTheme }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data } = useNotificationSummary({
    pageSize: 5,
    refetchInterval: 12000,
    enabled: isAuthenticated,
  });
  const unreadCount = data?.unreadCount ?? 0;

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="z-20 flex min-h-16 flex-shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-border dark:bg-background sm:px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        <div className="mr-2 flex min-w-0 items-center sm:mr-4 lg:mr-6">
          <Link
            to="/dashboard"
            className="max-w-[7.5rem] truncate whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-sm font-semibold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:max-w-none sm:text-base lg:text-xl"
          >
            ACAD Assist
          </Link>
        </div>

        <SearchBar />
      </div>

      <div className="ml-2 flex shrink-0 items-center gap-1 sm:ml-3 sm:gap-2">
        <button
          onClick={handleThemeToggle}
          className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <Link
          to="/notifications"
          className="relative rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white dark:ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Link>

        <button
          onClick={toggleRightPanel}
          className="relative hidden items-center justify-center rounded-full p-1.5 text-indigo-500 transition-colors hover:bg-indigo-50 dark:text-brand-purple dark:hover:bg-surface-hover xl:flex"
        >
          <Sparkles className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500"></span>
          </span>
        </button>

        <div className="mx-1 hidden h-6 border-l border-gray-200 dark:border-border md:block"></div>

        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
