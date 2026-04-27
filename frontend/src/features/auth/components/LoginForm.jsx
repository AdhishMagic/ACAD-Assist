import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ROUTE_PATHS } from '@/app/routes/routePaths';
import { authAPI } from '../services/authAPI';
import { setCredentials } from '../store/authSlice';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.access, refreshToken: data.refresh }));
      navigate(ROUTE_PATHS.DASHBOARD, { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
  };

  const errorMessage =
    loginMutation.error?.message ||
    'Login failed. Please check your credentials and try again.';

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {loginMutation.isError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Alert variant="destructive" className="bg-red-50/50 border-red-200/50 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Email address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground transition-colors">
              <Lock className="h-4 w-4" />
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-900/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 transition-all"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full h-11 font-medium transition-all group"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

    </div>
  );
};
