import React from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';
import { AUTH_ROUTES } from '../constants/authRoutes';

export const RegisterPage = () => {
  return (
    <div className="w-full flex flex-col">
      <AuthCard 
        title="Create an account" 
        description="Fill out the basic details below to setup your new ACAD-Assist profile."
        footer={
          <div className="text-sm text-muted-foreground w-full flex justify-center lg:justify-start">
            Already have an account?{' '}
            <Link to={AUTH_ROUTES.LOGIN} className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </div>
        }
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
};
