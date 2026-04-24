import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, FolderOpen, LayoutGrid } from 'lucide-react';
import { ROUTE_PATHS, buildPath } from '@/app/routes/routePaths';
import { useNoteSubjects } from '../hooks/useNotes';

const SidebarLink = ({ to, icon: Icon, activeIcon: ActiveIcon, label, count, end, onNavigate }) => {
  return (
    <NavLink to={to} end={end} onClick={onNavigate}>
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

const SubjectSidebar = ({ isOpen = false, onClose }) => {
  const { data: subjects } = useNoteSubjects();
  const subjectList = Array.isArray(subjects) ? subjects : [];

  return (
    <>
      {isOpen ? <button type="button" className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} aria-label="Close subjects" /> : null}
      <motion.aside 
        initial={false}
        animate={{ x: isOpen ? 0 : -320, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={`fixed inset-y-0 left-0 z-30 w-[85vw] max-w-72 border-r border-border bg-card/95 backdrop-blur-sm md:static md:z-auto md:w-64 md:max-w-none md:translate-x-0 ${
          isOpen ? 'block' : 'hidden'
        } md:flex md:flex-col`}
      >
      <div className="p-4 sm:p-6 pb-2">
        <h2 className="font-semibold text-lg tracking-tight">Library</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <SidebarLink 
          to={ROUTE_PATHS.STUDENT_NOTES}
          icon={LayoutGrid} 
          label="All Notes" 
          end 
          onNavigate={onClose}
        />
        
        <div className="pt-6 pb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
            Subjects
          </p>
        </div>
        
        {subjectList.map((subject) => (
          <SidebarLink
            key={subject.id}
            to={buildPath.studentNotesSubject(subject.id)}
            icon={Folder}
            activeIcon={FolderOpen}
            label={subject.name}
            count={subject.count}
            onNavigate={onClose}
          />
        ))}
      </div>
      </motion.aside>
    </>
  );
};

export default SubjectSidebar;
