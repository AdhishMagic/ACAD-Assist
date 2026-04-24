import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Pane - Branding & Decoration */}
      <div className="relative hidden lg:flex flex-col bg-zinc-950 px-12 pb-12 pt-6 text-white overflow-hidden justify-center items-start text-left">
        {/* Background Gradients & Effects */}
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-color-dodge"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-indigo-500/20 blur-[120px] rounded-full"></div>
        
        {/* Top bar with Logo */}
        <div className="relative z-10 mb-12">
          <Link to="/" className="inline-flex items-center gap-2 group transition-opacity hover:opacity-90">
            <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-colors">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              ACAD-Assist
            </span>
          </Link>
        </div>

        {/* Dynamic Marketing Content */}
        <div className="relative z-10 mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegister ? 'register' : 'login'}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight max-w-lg text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
                {isRegister 
                  ? 'Join the future of academic collaboration.' 
                  : 'Welcome back to your academic workspace.'}
              </h1>
              <p className="text-lg text-zinc-400 max-w-md font-medium leading-relaxed">
                {isRegister
                  ? 'Connect with peers, access premium study tools, and elevate your learning experience with AI.'
                  : 'Pick up right where you left off. Your study materials and AI tools are waiting for you.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer info inside the branding pane */}
        <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-zinc-500">
          <span>&copy; {new Date().getFullYear()} ACAD-Assist</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
        </div>
      </div>

      {/* Right Pane - Auth Forms Outlet */}
      <div className="relative flex items-center justify-center bg-white px-4 py-8 dark:bg-zinc-950 sm:px-8 sm:py-12 lg:p-16">
        {/* Mobile Logo (hidden on desktop) */}
        <div className="absolute left-4 top-4 sm:left-8 sm:top-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-xl dark:bg-white/10">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold tracking-tight">ACAD-Assist</span>
            </Link>
        </div>

        <div className="w-full max-w-[420px] pt-14 sm:pt-16 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
