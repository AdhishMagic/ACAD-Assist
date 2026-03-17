import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closePalette = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const executeCommand = (command) => {
    if (command.action) {
      command.action();
    } else if (command.href) {
      navigate(command.href);
    }
    closePalette();
  };

  return {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    executeCommand,
    closePalette
  };
};
