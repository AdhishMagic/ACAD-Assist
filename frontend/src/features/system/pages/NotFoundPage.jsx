import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Page not found</h2>
          <p className="text-gray-500">
            Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or didn't exist in the first place.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
