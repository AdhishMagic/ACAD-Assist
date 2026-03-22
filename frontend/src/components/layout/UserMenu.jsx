import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../features/auth/store/authSlice';
import { getDisplayNameFromUser, getInitials, toTitleCase } from '@/utils/helpers';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const activeRole = useSelector((state) => state.auth.activeRole);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const displayName = getDisplayNameFromUser(user) || 'User';
  const initials = getInitials(displayName || user?.email);
  const roleLabel = toTitleCase(activeRole || user?.role || 'student');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{displayName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{roleLabel}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 z-50"
          >
            <div className="py-1">
              <Link to="/profile" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                Profile
              </Link>
              <Link to="/settings" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                Settings
              </Link>
            </div>
            <div className="py-1">
              <button onClick={handleLogout} className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
