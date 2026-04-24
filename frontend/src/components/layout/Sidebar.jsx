import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  FileText,
  FileQuestion,
  BarChart3,
  Bookmark,
  Upload,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Activity,
  TrendingUp,
  FileCheck,
  CheckSquare,
  Database,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { logout, selectCurrentUser } from '../../features/auth/store/authSlice';
import { hasTeacherAccess, normalizeRole } from '@/features/auth/utils/role';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { getDisplayNameFromUser, getInitials, toTitleCase } from '@/utils/helpers';

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobileSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  ));
  const user = useSelector(selectCurrentUser);
  const activeRole = useSelector((state) => state.auth.activeRole);
  const { pathname } = useLocation();
  const userRole = normalizeRole(activeRole || user?.role) || 'student';
  const displayName = getDisplayNameFromUser(user) || 'User';
  const initials = getInitials(displayName || user?.email);
  const roleLabel = toTitleCase(userRole || 'student');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      setIsHovered(false);
    }
  }, [isMobileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const normalizePath = (path) => {
    if (!path) return '/';
    const normalized = path.replace(/\/+$/, '');
    return normalized || '/';
  };

  const navSections = useMemo(() => {
    const studentSections = [
      {
        title: 'Academic',
        items: [
          { label: 'Study Overview', icon: LayoutDashboard, to: '/student/study-overview' },
          { label: 'Notes Explorer', icon: BookOpen, to: '/student/notes' },
        ],
      },
      {
        title: 'AI Tools',
        items: [
          { label: 'AI Study Assistant', icon: BrainCircuit, to: '/student/ai', end: true },
          { label: 'AI Generated Notes', icon: FileText, to: '/student/ai/generated' },
        ],
      },
      {
        title: 'Insights',
        items: [
          { label: 'Saved / Bookmarked', icon: Bookmark, to: '/student/ai/saved-notes' },
        ],
      },
      {
        title: 'System',
        items: [
          { label: 'Project Submission', icon: Upload, to: '/student/project-submission' },
        ],
      },
    ];

    const roleItems = {
      teacher: [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
        { label: 'Cohorts', icon: Users, to: '/teacher/classes' },
        { label: 'Activity Monitor', icon: Activity, to: '/teacher/activity' },
        { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
        { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
        { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
        { label: 'Question Paper Generator', icon: FileQuestion, to: ROUTE_PATHS.TEACHER_QUESTION_PAPER },
      ],
      hod: [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/hod/dashboard' },
        { label: 'Department Performance', icon: TrendingUp, to: '/hod/performance' },
        { label: 'Teacher Contributions', icon: Users, to: '/hod/teacher-contributions' },
        { label: 'Material Approval', icon: CheckSquare, to: '/hod/material-approval' },
        { label: 'Project Approvals', icon: FileCheck, to: '/hod/project-approvals' },
        { label: 'Student Analytics', icon: BarChart3, to: '/hod/student-analytics' },
        { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
        { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
        { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
        { label: 'Question Paper Generator', icon: FileQuestion, to: ROUTE_PATHS.TEACHER_QUESTION_PAPER },
      ],
    };

    if (userRole === 'student') {
      return studentSections;
    }

    if (userRole === 'admin') {
      return [
        {
          title: 'Admin',
          items: [
            { label: 'Admin Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
            { label: 'System Analytics', icon: BarChart3, to: '/admin/analytics' },
            { label: 'User Management', icon: Users, to: '/admin/users' },
            { label: 'Activity Logs', icon: Activity, to: '/admin/activity-logs' },
            { label: 'Storage Management', icon: Database, to: '/admin/storage' },
            { label: 'AI Usage Analytics', icon: BrainCircuit, to: '/admin/ai-usage' },
            { label: 'Student Analytics', icon: BarChart3, to: '/admin/student-analytics' },
          ],
        },
        {
          title: 'Student Features',
          items: [
            { label: 'Student Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
            { label: 'Study Overview', icon: LayoutDashboard, to: '/student/study-overview' },
            { label: 'Notes Explorer', icon: BookOpen, to: '/student/notes' },
            { label: 'AI Study Assistant', icon: BrainCircuit, to: '/student/ai', end: true },
            { label: 'Saved / Bookmarked', icon: Bookmark, to: '/student/ai/saved-notes' },
            { label: 'AI Generated Notes', icon: FileText, to: '/student/ai/generated' },
            { label: 'Project Submission', icon: Upload, to: '/student/project-submission' },
          ],
        },
        {
          title: 'Teacher Features',
          items: [
            { label: 'Teacher Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
            { label: 'Cohorts', icon: Users, to: '/teacher/classes' },
            { label: 'Activity Monitor', icon: Activity, to: '/teacher/activity' },
            { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
            { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
            { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
            { label: 'Question Paper Generator', icon: FileQuestion, to: ROUTE_PATHS.TEACHER_QUESTION_PAPER },
          ],
        },
        {
          title: 'HOD Features',
          items: [
            { label: 'HOD Dashboard', icon: LayoutDashboard, to: '/hod/dashboard' },
            { label: 'Department Performance', icon: TrendingUp, to: '/hod/performance' },
            { label: 'Teacher Contributions', icon: Users, to: '/hod/teacher-contributions' },
            { label: 'Material Approval', icon: CheckSquare, to: '/hod/material-approval' },
            { label: 'Project Approvals', icon: FileCheck, to: '/hod/project-approvals' },
            { label: 'Student Analytics', icon: BarChart3, to: '/hod/student-analytics' },
          ],
        },
      ];
    }

    const workspaceItems = userRole === 'hod'
      ? roleItems.hod
      : (hasTeacherAccess(userRole) ? roleItems.teacher : roleItems[userRole]);

    return [
      {
        title: 'Workspace',
        items: workspaceItems || [{ label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' }],
      },
      {
        title: 'System',
        items: [],
      },
    ];
  }, [userRole]);

  const visibleNavSections = navSections.filter((section) => section.items.length > 0);
  const navItems = visibleNavSections.flatMap((section) => section.items);
  const currentPath = normalizePath(pathname);
  const isExpanded = isDesktop ? (!isCollapsed || isHovered) : isMobileOpen;

  const matchesItem = (item) => {
    const targetPath = normalizePath(item.to);
    if (item.end) {
      return currentPath === targetPath;
    }
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const activeItem = navItems
    .filter(matchesItem)
    .sort((a, b) => normalizePath(b.to).length - normalizePath(a.to).length)[0];
  const activePath = activeItem ? normalizePath(activeItem.to) : '';

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 264 : 72 }}
        transition={{ duration: 0.26, ease: 'easeInOut' }}
        onMouseEnter={() => isDesktop && setIsHovered(true)}
        onMouseLeave={() => isDesktop && setIsHovered(false)}
        className={`fixed left-0 top-0 z-50 flex h-screen w-[min(264px,85vw)] max-w-[85vw] flex-col border-r border-gray-200 bg-slate-50 shadow-sm transition-transform duration-300 ease-in-out dark:border-border dark:bg-background dark:shadow-xl dark:shadow-black/30 lg:z-30 lg:w-auto lg:max-w-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-border">
          <div className="flex w-full items-center justify-start">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-sm"
              aria-label="ACAD Assist"
            >
              A
            </button>
          </div>

          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white lg:hidden"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="scrollbar-hide flex-1 overflow-y-auto px-3 py-4">
          {visibleNavSections.map((section) => (
            <div key={section.title} className="mb-5">
              {isExpanded && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-400">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  onClick={() => {
                    if (!isDesktop) {
                      closeMobileSidebar();
                    }
                  }}
                  isActive={normalizePath(item.to) === activePath}
                  isCollapsed={!isExpanded}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-gray-200 p-3 dark:border-border">
          <div className="flex min-h-10 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/90 text-sm font-semibold text-white">
              {initials}
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{displayName}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-300">{roleLabel}</p>
              </div>
            )}
          </div>

          <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center flex-col gap-2'}`}>
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? 'Pin sidebar open' : 'Collapse sidebar'}
              className="hidden rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white lg:inline-flex"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            <button
              onClick={() => navigate('/settings')}
              title="Settings"
              className="rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-200 hover:text-red-600 dark:text-gray-300 dark:hover:bg-surface-hover dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
