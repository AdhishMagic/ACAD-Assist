import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authAPI } from '../services/authAPI';
import { AUTH_ROUTES } from '../constants/authRoutes';

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const resetMutation = useMutation({
    mutationFn: authAPI.forgotPassword,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMutation.mutate({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {resetMutation.isSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>
            If an account exists with this email, a reset link has been sent.
          </AlertDescription>
        </Alert>
      )}

      {resetMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {resetMutation.error?.response?.data?.message || 'Failed to send reset link.'}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button 
          type="submit" 
          className="w-full"
          disabled={resetMutation.isPending || resetMutation.isSuccess}
        >
          {resetMutation.isPending ? 'Sending...' : 'Send reset link'}
        </Button>
      </motion.div>

      <div className="text-center mt-4">
        <Link 
          to={AUTH_ROUTES.LOGIN} 
          className="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
};
