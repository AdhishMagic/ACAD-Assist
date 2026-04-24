import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { authAPI } from '../services/authAPI';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      navigate(ROUTE_PATHS.LOGIN, { state: { message: 'Registration successful. Please sign in to continue.' } });
    },
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, termsAccepted: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const fullName = formData.fullName.trim();
    const [firstName = '', ...restNameParts] = fullName.split(/\s+/).filter(Boolean);
    const lastName = restNameParts.join(' ');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (!formData.termsAccepted) {
      setValidationError('You must accept the terms and conditions');
      return;
    }

    registerMutation.mutate({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      first_name: firstName,
      last_name: lastName,
    });
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {(validationError || registerMutation.isError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Alert variant="destructive" className="bg-red-50/50 border-red-200/50 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
              <AlertDescription>
                {validationError || registerMutation.error?.message || 'Registration failed. Please try again.'}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors">
              <User className="h-4 w-4" />
            </div>
            <Input 
              id="fullName" 
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={handleChange}
                className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-4 pb-2">
          <Checkbox 
            id="terms" 
            checked={formData.termsAccepted}
            onCheckedChange={handleCheckboxChange}
            className="mt-1 flex-shrink-0"
          />
          <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            By creating an account, you agree to our{' '}
            <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
          </Label>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full h-11 font-medium transition-all group"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  );
};
