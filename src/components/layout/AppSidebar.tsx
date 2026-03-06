import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, UserCog, ClipboardCheck, BookOpen, Calendar,
  FileText, CreditCard, DollarSign, Library, Bus, Package, Shield,
  MessageSquare, CalendarDays, Settings, LogOut, GraduationCap, Clock, PackageCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type NavItem = { label: string; icon: React.ElementType; path: string; roles: string[] };

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Schools', icon: GraduationCap, path: '/schools', roles: ['admin'] },
  { label: 'Students', icon: Users, path: '/students', roles: ['admin', 'sub_admin', 'teacher'] },
  { label: 'Staff', icon: UserCog, path: '/staff', roles: ['admin', 'sub_admin'] },
  { label: 'Attendance', icon: ClipboardCheck, path: '/attendance', roles: ['admin', 'sub_admin', 'teacher'] },
  { label: 'Academics', icon: BookOpen, path: '/academics', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Timetable', icon: Clock, path: '/timetable', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Assignments', icon: FileText, path: '/assignments', roles: ['admin', 'sub_admin', 'teacher', 'student'] },
  { label: 'Fees', icon: CreditCard, path: '/fees', roles: ['admin', 'sub_admin', 'parent', 'student'] },
  { label: 'Finance', icon: DollarSign, path: '/finance', roles: ['admin', 'sub_admin'] },
  { label: 'Library', icon: Library, path: '/library', roles: ['admin', 'sub_admin', 'teacher', 'student'] },
  { label: 'Transport', icon: Bus, path: '/transport', roles: ['admin', 'sub_admin', 'parent'] },
  { label: 'Inventory', icon: Package, path: '/inventory', roles: ['admin', 'sub_admin'] },
  { label: 'Discipline', icon: Shield, path: '/discipline', roles: ['admin', 'sub_admin', 'teacher'] },
  { label: 'Communication', icon: MessageSquare, path: '/communication', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Events', icon: CalendarDays, path: '/events', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Materials', icon: PackageCheck, path: '/materials', roles: ['admin', 'sub_admin', 'teacher', 'student', 'parent'] },
  { label: 'Permissions', icon: Shield, path: '/permissions', roles: ['admin'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'sub_admin'] },
];

const AppSidebar = () => {
  const { role, profile, signOut } = useAuth();
  const { currentSchool } = useSchool();
  const navigate = useNavigate();

  const filtered = navItems.filter(item => role && item.roles.includes(role));
  const displayName = role === 'sub_admin' && currentSchool ? currentSchool.name : 'Academic Hub';
  const roleLabel = role === 'sub_admin' ? 'Sub-Admin' : role;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar-background text-sidebar-foreground h-screen sticky top-0">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
        {currentSchool?.logo_url ? (
          <img src={currentSchool.logo_url} alt="Logo" className="w-9 h-9 rounded-lg object-contain bg-white/10" />
        ) : (
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-sidebar-foreground">{displayName}</p>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {filtered.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate text-sidebar-foreground">{profile?.full_name}</p>
          <p className="text-xs text-sidebar-foreground/50 truncate">{profile?.email}</p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
