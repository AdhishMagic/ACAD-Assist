import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Users, GraduationCap, UserCog, Settings2 } from 'lucide-react';

import { AuthCard } from '../components/AuthCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logout, setActiveRole, setPendingRole } from '../store/authSlice';

const ROLE_OPTIONS = [
  {
    key: 'student',
    title: 'Student',
    description: 'Dashboard, notes, AI study assistant, analytics.',
    icon: GraduationCap,
  },
  {
    key: 'teacher',
    title: 'Teacher',
    description: 'Classes, monitor students, create notes, generate papers.',
    icon: Users,
  },
  {
    key: 'hod',
    title: 'HOD',
    description: 'Department performance, approvals, engagement analytics.',
    icon: UserCog,
  },
  {
    key: 'admin',
    title: 'Admin',
    description: 'System analytics, user/role management, logs, storage.',
    icon: Shield,
  },
  {
    key: 'system',
    title: 'System',
    description: 'System-level tools and monitoring.',
    icon: Settings2,
  },
];

export const RoleConfirmPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const message = location.state?.message;

  const handleConfirm = (roleKey) => {
    if (isAuthenticated) {
      dispatch(setActiveRole(roleKey));
      navigate('/dashboard', { replace: true });
      return;
    }

    dispatch(setPendingRole(roleKey));
    navigate('/login', { replace: true, state: message ? { message } : undefined });
  };

  return (
    <AuthCard
      title={`Choose your access type${user?.first_name ? `, ${user.first_name}` : ''}`}
      description="Select Admin / HOD / Student / System / Teacher first. Then sign in to access only that role's pages."
    >
      <div className="space-y-4">
        {message ? (
          <div className="text-sm text-muted-foreground">
            {message}
          </div>
        ) : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROLE_OPTIONS.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.key}
                className="cursor-pointer hover:border-primary/40 hover:shadow-sm transition-colors"
                onClick={() => handleConfirm(role.key)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleConfirm(role.key);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                        {role.title}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              if (isAuthenticated) {
                dispatch(logout());
              }
              navigate('/', { replace: true });
            }}
          >
            Back
          </Button>
        </div>
      </div>
    </AuthCard>
  );
};

export default RoleConfirmPage;
