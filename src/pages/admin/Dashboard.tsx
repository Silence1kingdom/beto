import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users, MessageSquare, Eye } from 'lucide-react';
import { adminT } from '@/lib/admin-lang';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { labelKey: 'dashboard.totalProjects', value: '0', icon: FolderKanban, color: 'text-electric-cyan' },
    { labelKey: 'dashboard.teamMembers', value: '0', icon: Users, color: 'text-neon-purple' },
    { labelKey: 'dashboard.messages', value: '0', icon: MessageSquare, color: 'text-electric-blue' },
    { labelKey: 'dashboard.siteVisits', value: '0', icon: Eye, color: 'text-green-400' },
  ]);

  useEffect(() => {
    const storedProjects = localStorage.getItem('admin_projects');
    const storedTeam = localStorage.getItem('admin_team_members');
    const storedMessages = localStorage.getItem('contact_messages');
    setStats([
      { labelKey: 'dashboard.totalProjects', value: storedProjects ? String(JSON.parse(storedProjects).length) : '0', icon: FolderKanban, color: 'text-electric-cyan' },
      { labelKey: 'dashboard.teamMembers', value: storedTeam ? String(JSON.parse(storedTeam).length) : '0', icon: Users, color: 'text-neon-purple' },
      { labelKey: 'dashboard.messages', value: storedMessages ? String(JSON.parse(storedMessages).length) : '0', icon: MessageSquare, color: 'text-electric-blue' },
      { labelKey: 'dashboard.siteVisits', value: '—', icon: Eye, color: 'text-green-400' },
    ]);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white">{adminT('dashboard.title')}</h1>
        <p className="mt-1 text-white/40">{adminT('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.labelKey}
            className="border-electric-cyan/10 bg-white/5 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/60">
                {adminT(stat.labelKey)}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="font-space text-3xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="border-electric-cyan/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">{adminT('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/40">
              {adminT('dashboard.recentActivityDesc')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-electric-cyan/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">{adminT('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-white/40">
              {adminT('dashboard.quickActionsDesc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
