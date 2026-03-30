import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, LayoutGrid } from 'lucide-react';
import { NOTES_ROUTES } from '../constants/notesRoutes';
import { mockNoteSubjects } from '@/shared/mocks/notes.mock';

const SidebarLink = ({ to, icon: Icon, activeIcon: ActiveIcon, label, count, end }) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink to={to} end={end}>
      {({ isActive: navIsActive }) => {
        const CurrentIcon = navIsActive ? (ActiveIcon || Icon) : Icon;
        return (
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
              navIsActive 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CurrentIcon className={`h-5 w-5 ${navIsActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="truncate max-w-[140px]">{label}</span>
            </div>
            {count !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                navIsActive ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'
              }`}>
                {count}
              </span>
            )}
          </motion.div>
        );
      }}
    </NavLink>
  );
};

const SubjectSidebar = () => {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 flex-shrink-0 border-r border-border h-full bg-card/50 backdrop-blur-sm hidden md:flex flex-col"
    >
      <div className="p-6 pb-2">
        <h2 className="font-semibold text-lg tracking-tight">Library</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <SidebarLink 
          to={NOTES_ROUTES.EXPLORER} 
          icon={LayoutGrid} 
          label="All Notes" 
          end 
        />
        
        <div className="pt-6 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            Subjects
          </p>
        </div>
        
        {mockNoteSubjects.map((subject) => (
          <SidebarLink
            key={subject.id}
            to={NOTES_ROUTES.SUBJECT(subject.id)}
            icon={Folder}
            activeIcon={FolderOpen}
            label={subject.name}
            count={subject.count}
          />
        ))}
      </div>
    </motion.aside>
  );
};

export default SubjectSidebar;
