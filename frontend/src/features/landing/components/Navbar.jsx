import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLinks } from '../constants/landingContent';
import { Button } from '@/components/ui/button'; // Assuming shadcn UI Button exists here
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionIds = useMemo(() => {
    return NavLinks
      .map((l) => (typeof l.href === 'string' ? l.href : ''))
      .filter((href) => href.startsWith('#'))
      .map((href) => href.replace('#', ''))
      .filter(Boolean);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const next = total > 0 ? window.scrollY / total : 0;
      setScrollProgress(Math.min(1, Math.max(0, next)));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        const top = visible[0]?.target?.id;
        if (top) setActiveSection(top);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: '-20% 0px -65% 0px',
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const onNavClick = (href) => (e) => {
    if (typeof href !== 'string' || !href.startsWith('#')) return;
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', href);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="section-shell h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            A
          </div>
          <span className="font-bold text-xl tracking-tight">ACAD-Assist</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {NavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onNavClick(link.href)}
              className={
                "text-sm font-medium transition-colors " +
                (link.href === `#${activeSection}`
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground')
              }
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild className="px-3 sm:px-4">
            <Link to="/register">Get Started</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Scroll progress */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent">
        <div
          className="h-full bg-primary/70 origin-left"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
        >
          <div className="section-shell py-4 flex flex-col gap-2">
            {NavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onNavClick(link.href)}
                className={
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors " +
                  (link.href === `#${activeSection}`
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted')
                }
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2 sm:hidden">
              <Button variant="ghost" asChild className="justify-start">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild className="justify-start">
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </nav>
  );
};

export default Navbar;
