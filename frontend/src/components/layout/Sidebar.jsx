import React, { useMemo, useState } from 'react';
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
  CheckSquare,
  TrendingUp,
  FileCheck,
  Database
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { logout, selectCurrentUser } from '../../features/auth/store/authSlice';
import { hasTeacherAccess, normalizeRole } from '@/features/auth/utils/role';
import { getDisplayNameFromUser, getInitials, toTitleCase } from '@/utils/helpers';

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobileSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector(selectCurrentUser);
  const activeRole = useSelector((state) => state.auth.activeRole);
  const { pathname } = useLocation();
  const userRole = normalizeRole(activeRole || user?.role) || 'student';
  const displayName = getDisplayNameFromUser(user) || 'User';
  const initials = getInitials(displayName || user?.email);
  const roleLabel = toTitleCase(userRole || 'student');

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
          { label: 'Question Paper', icon: FileQuestion, to: '/student/qpaper/generate' },
        ],
      },
      {
        title: 'Insights',
        items: [
          { label: 'Student Analytics', icon: BarChart3, to: '/student/analytics' },
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
        { label: 'Classes', icon: Users, to: '/teacher/classes' },
        { label: 'Activity Monitor', icon: Activity, to: '/teacher/activity' },
        { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
        { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
        { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
        { label: 'AI Exam Generation', icon: Upload, to: '/teacher/materials-upload' },
        { label: 'Online Tests', icon: CheckSquare, to: '/teacher/online-tests' },
      ],
      hod: [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/hod/dashboard' },
        { label: 'Department Performance', icon: TrendingUp, to: '/hod/performance' },
        { label: 'Teacher Contributions', icon: Users, to: '/hod/teacher-contributions' },
        { label: 'Material Approval', icon: CheckSquare, to: '/hod/material-approval' },
        { label: 'Student Engagement', icon: Activity, to: '/hod/student-engagement' },
        { label: 'Project Approvals', icon: FileCheck, to: '/hod/project-approvals' },
        { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
        { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
        { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
        { label: 'AI Features', icon: BrainCircuit, to: '/teacher/materials-upload' },
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
            { label: 'Question Paper', icon: FileQuestion, to: '/student/qpaper/generate' },
            { label: 'Student Analytics', icon: BarChart3, to: '/student/analytics' },
            { label: 'Project Submission', icon: Upload, to: '/student/project-submission' },
          ],
        },
        {
          title: 'Teacher Features',
          items: [
            { label: 'Teacher Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
            { label: 'Classes', icon: Users, to: '/teacher/classes' },
            { label: 'Activity Monitor', icon: Activity, to: '/teacher/activity' },
            { label: 'Notes Studio', icon: FileText, to: '/teacher/notes-studio' },
            { label: 'Saved Notes', icon: Bookmark, to: '/teacher/saved-notes' },
            { label: 'Notes Explorer', icon: BookOpen, to: '/teacher/explore-notes' },
            { label: 'AI Exam Generation', icon: Upload, to: '/teacher/materials-upload' },
            { label: 'Online Tests', icon: CheckSquare, to: '/teacher/online-tests' },
          ],
        },
        {
          title: 'HOD Features',
          items: [
            { label: 'HOD Dashboard', icon: LayoutDashboard, to: '/hod/dashboard' },
            { label: 'Department Performance', icon: TrendingUp, to: '/hod/performance' },
            { label: 'Teacher Contributions', icon: Users, to: '/hod/teacher-contributions' },
            { label: 'Material Approval', icon: CheckSquare, to: '/hod/material-approval' },
            { label: 'Student Engagement', icon: Activity, to: '/hod/student-engagement' },
            { label: 'Project Approvals', icon: FileCheck, to: '/hod/project-approvals' },
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
  const isExpanded = isMobileOpen || !isCollapsed || isHovered;

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
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar container */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 264 : 72,
          x: 0
        }}
        transition={{ duration: 0.26, ease: 'easeInOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col bg-slate-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="w-full flex items-center justify-center md:justify-start">
            <button
              type="button"
              className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm"
              aria-label="ACAD Assist"
            >
              A
            </button>
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
          {visibleNavSections.map((section) => (
            <div key={section.title} className="mb-5">
              {isExpanded && (
                <p className="px-3 mb-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-gray-400 dark:text-gray-500">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  isActive={normalizePath(item.to) === activePath}
                  isCollapsed={!isExpanded}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-2.5 min-h-10">
            <div className="h-9 w-9 rounded-full bg-blue-500/90 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            {isExpanded && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{roleLabel}</p>
              </div>
            )}
          </div>

          <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center flex-col gap-2'}`}>
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? 'Pin sidebar open' : 'Collapse sidebar'}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            <button
              onClick={() => navigate('/settings')}
              title="Settings"
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
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
