import { NavLink } from 'react-router';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  LogOut,
  ArrowLeft,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { adminT } from '@/lib/admin-lang';

export default function AdminSidebar() {
  const { logout, isAuthenticated } = useAdmin();

  const navItems = [
    { label: adminT('sidebar.dashboard'), to: '/admin', icon: LayoutDashboard },
    { label: adminT('sidebar.projects'), to: '/admin/projects', icon: FolderKanban },
    { label: adminT('sidebar.team'), to: '/admin/team', icon: Users },
    { label: adminT('sidebar.messages'), to: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-electric-cyan/10 bg-deep-navy/95 backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-electric-cyan/10 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-cyan text-xs font-bold text-void-black">
          B
        </div>
        <div>
          <h2 className="font-space text-sm font-bold text-white">{adminT('sidebar.panel')}</h2>
          <p className="text-[10px] text-white/40">{adminT('sidebar.studio')}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-electric-cyan/10 text-electric-cyan'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        {isAuthenticated && (
          <NavLink
            to="/admin/register"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-electric-cyan/10 text-electric-cyan'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            {adminT('sidebar.register')}
          </NavLink>
        )}
      </nav>

      <div className="border-t border-electric-cyan/10 p-3">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 transition-all duration-200 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {adminT('sidebar.back')}
        </NavLink>
        <Button
          variant="ghost"
          className="mt-1 w-full justify-start gap-3 text-sm font-medium text-white/50 hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {adminT('sidebar.logout')}
        </Button>
      </div>
    </aside>
  );
}
