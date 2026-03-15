import React from 'react';
import { motion } from 'framer-motion';

export const AuthCard = ({ title, description, children, footer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-2 text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {/* Main Content / Form Section */}
        <div className="bg-transparent">
          {children}
        </div>
        
        {/* Footer Section */}
        {footer && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-start text-sm pt-6">
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
};
