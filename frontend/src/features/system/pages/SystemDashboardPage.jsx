import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, ShieldCheck } from 'lucide-react';

export default function SystemDashboardPage() {
  const cards = [
    {
      title: 'System Health',
      icon: Activity,
      value: 'OK',
      subtitle: 'All services responding',
    },
    {
      title: 'Storage',
      icon: Database,
      value: '—',
      subtitle: 'Manage uploads and files',
    },
    {
      title: 'Security',
      icon: ShieldCheck,
      value: '—',
      subtitle: 'Audit access and roles',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
        <p className="text-muted-foreground mt-1">System-level monitoring and utilities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
