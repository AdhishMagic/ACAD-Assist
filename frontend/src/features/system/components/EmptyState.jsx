import React from 'react';
import { FileQuestion } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = ({ 
  icon: Icon = FileQuestion, 
  title = "No data found", 
  description = "Get started by creating a new entry.",
  action 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Icon className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};
