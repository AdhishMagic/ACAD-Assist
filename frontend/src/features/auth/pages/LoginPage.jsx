import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { AUTH_ROUTES } from '../constants/authRoutes';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LoginPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="w-full flex flex-col">
      {message && (
        <div className="w-full mb-6 relative">
          <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
            <AlertDescription className="font-medium text-sm">{message}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <AuthCard 
        title="Sign in" 
        description="Enter your email and password to safely access your account."
        footer={
          <div className="text-sm text-muted-foreground w-full flex justify-center lg:justify-start">
            Don't have an account?{' '}
            <Link to={AUTH_ROUTES.REGISTER} className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
};
