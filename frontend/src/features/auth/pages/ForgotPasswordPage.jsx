import React from 'react';
import { AuthCard } from '../components/AuthCard';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <AuthCard 
        title="Reset password" 
        description="Enter your email address and we'll send you a link to reset your password"
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
};
