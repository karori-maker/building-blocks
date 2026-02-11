import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, UserCog, ClipboardCheck, BookOpen, Calendar,
  FileText, CreditCard, DollarSign, Library, Bus, Package, Shield,
  MessageSquare, CalendarDays, Settings, LogOut, GraduationCap, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = { label: string; icon: React.ElementType; path: string; roles: string[] };

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Students', icon: Users, path: '/students', roles: ['admin', 'teacher'] },
  { label: 'Staff', icon: UserCog, path: '/staff', roles: ['admin'] },
  { label: 'Attendance', icon: ClipboardCheck, path: '/attendance', roles: ['admin', 'teacher'] },
  { label: 'Academics', icon: BookOpen, path: '/academics', roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Timetable', icon: Clock, path: '/timetable', roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Assignments', icon: FileText, path: '/assignments', roles: ['admin', 'teacher', 'student'] },
  { label: 'Fees', icon: CreditCard, path: '/fees', roles: ['admin', 'parent', 'student'] },
  { label: 'Finance', icon: DollarSign, path: '/finance', roles: ['admin'] },
  { label: 'Library', icon: Library, path: '/library', roles: ['admin', 'teacher', 'student'] },
  { label: 'Transport', icon: Bus, path: '/transport', roles: ['admin', 'parent'] },
  { label: 'Inventory', icon: Package, path: '/inventory', roles: ['admin'] },
  { label: 'Discipline', icon: Shield, path: '/discipline', roles: ['admin', 'teacher'] },
  { label: 'Communication', icon: MessageSquare, path: '/communication', roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Events', icon: CalendarDays, path: '/events', roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
];

const AppSidebar = () => {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const filtered = navItems.filter(item => role && item.roles.includes(role));

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-sidebar-background text-sidebar-foreground h-screen sticky top-0">
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Westfield Academy</p>
          <p className="text-xs text-muted-foreground capitalize">{role}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {filtered.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t space-y-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{profile?.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
