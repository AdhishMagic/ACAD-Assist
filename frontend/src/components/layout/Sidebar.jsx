import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlayCircle,
  BookOpen, 
  Library,
  BrainCircuit, 
  Bookmark,
  BarChart,
  Bell,
  Search,
  User,
  Settings, 
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Activity,
  FileText,
  CheckSquare,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Database,
  Upload,
  Braces
} from 'lucide-react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ isCollapsed, toggleCollapse, isMobileOpen, closeMobileSidebar }) => {
  const { user, activeRole } = useSelector((state) => state.auth);
  const userRole = activeRole || user?.role || 'student'; // fallback

  const getNavItems = () => {
    const commonItems = [
      { label: 'Search', icon: Search, to: '/search' },
      { label: 'Notifications', icon: Bell, to: '/notifications' },
      { label: 'Profile', icon: User, to: '/profile' },
      { label: 'Settings', icon: Settings, to: '/settings' },
    ];

    const studentItems = [
      { label: 'Student Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
      { label: 'Study Overview', icon: PlayCircle, to: '/student/study-overview' },
      { label: 'Courses', icon: Library, to: '/student/courses' },
      { label: 'Notes Explorer', icon: BookOpen, to: '/student/notes' },
      { label: 'AI Study Assistant', icon: BrainCircuit, to: '/student/ai' },
      { label: 'Saved / Bookmarked Notes', icon: Bookmark, to: '/student/ai/saved-notes' },
      { label: 'AI Generated Notes Viewer', icon: FileText, to: '/student/ai/generated' },
      { label: 'Question Paper', icon: FileText, to: '/student/qpaper/generate' },
      { label: 'Student Analytics', icon: BarChart, to: '/student/analytics' },
      { label: 'Project Submission', icon: FileText, to: '/student/project-submission' },
    ];

    const teacherItems = [
      { label: 'Teacher Dashboard', icon: LayoutDashboard, to: '/teacher/dashboard' },
      { label: 'Classes Overview', icon: Users, to: '/teacher/classes' },
      { label: 'Student Activity Monitor', icon: Activity, to: '/teacher/activity' },
      { label: 'Notes Creation Studio', icon: FileText, to: '/teacher/notes-studio' },
      { label: 'Materials Upload Page', icon: Upload, to: '/teacher/materials-upload' },
      { label: 'JSON Template Builder', icon: Braces, to: '/teacher/template-builder' },
      { label: 'Template Preview Page', icon: FileText, to: '/teacher/template-preview' },
      { label: 'Question Paper Generator', icon: FileText, to: '/teacher/question-generator' },
      { label: 'Online Tests', icon: CheckSquare, to: '/teacher/online-tests' },
    ];

    const hodItems = [
      { label: 'HOD Dashboard', icon: LayoutDashboard, to: '/hod/dashboard' },
      { label: 'Department Performance', icon: TrendingUp, to: '/hod/performance' },
      { label: 'Teacher Contributions', icon: Users, to: '/hod/teacher-contributions' },
      { label: 'Course Materials Approval', icon: CheckSquare, to: '/hod/material-approval' },
      { label: 'Student Engagement Analytics', icon: Activity, to: '/hod/student-engagement' },
      { label: 'Project Approvals', icon: FileCheck, to: '/hod/project-approvals' },
    ];

    const adminItems = [
      { label: 'Admin Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
      { label: 'System Analytics', icon: BarChart, to: '/admin/analytics' },
      { label: 'User Management', icon: Users, to: '/admin/users' },
      { label: 'Role Management', icon: ShieldCheck, to: '/admin/roles' },
      { label: 'Activity Logs', icon: Activity, to: '/admin/activity-logs' },
      { label: 'Storage Management', icon: Database, to: '/admin/storage' },
      { label: 'AI Usage Analytics', icon: BrainCircuit, to: '/admin/ai-usage' },
    ];

    const systemItems = [
      { label: 'System Dashboard', icon: LayoutDashboard, to: '/system/dashboard' },
      { label: 'Activity Feed', icon: Activity, to: '/activity-feed' },
      { label: 'File Manager', icon: Database, to: '/file-manager' },
    ];

    switch (userRole) {
      case 'admin':
        return [...adminItems, ...commonItems];
      case 'hod':
        return [...hodItems, ...commonItems];
      case 'teacher':
        return [...teacherItems, ...commonItems];
      case 'system':
        return [...systemItems, ...commonItems];
      case 'student':
      default:
        return [...studentItems, ...commonItems];
    }
  };

  const navItems = getNavItems();

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
          width: isMobileOpen || !isCollapsed ? 240 : 72,
          x: isMobileOpen ? 0 : 0
        }}
        className={`fixed md:sticky top-0 left-0 z-40 h-screen flex flex-col bg-slate-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center">
            {/* Show logo or simple icon depending on collapse state */}
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                ACAD-Assist
              </span>
            )}
            {isCollapsed && !isMobileOpen && (
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold ml-1">
                A
              </div>
            )}
          </div>
          
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={closeMobileSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isCollapsed={isCollapsed && !isMobileOpen}
            />
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 hidden md:flex justify-end">
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors w-full flex justify-center"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
