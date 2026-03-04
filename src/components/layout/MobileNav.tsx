import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, GraduationCap, LogOut, LayoutDashboard, Users, UserCog, ClipboardCheck, BookOpen, Clock, FileText, CreditCard, DollarSign, Library, Bus, Package, Shield, MessageSquare, CalendarDays, Settings, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const iconMap: Record<string, React.ElementType> = {
  Dashboard: LayoutDashboard, Schools: GraduationCap, Students: Users, Staff: UserCog, Attendance: ClipboardCheck,
  Academics: BookOpen, Timetable: Clock, Assignments: FileText, Fees: CreditCard,
  Finance: DollarSign, Library: Library, Transport: Bus, Inventory: Package,
  Discipline: Shield, Communication: MessageSquare, Events: CalendarDays, Materials: PackageCheck, Settings: Settings,
};

const navItems = [
  { label: 'Dashboard', path: '/', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Schools', path: '/schools', roles: ['admin'] },
  { label: 'Students', path: '/students', roles: ['admin','sub_admin','teacher'] },
  { label: 'Staff', path: '/staff', roles: ['admin','sub_admin'] },
  { label: 'Attendance', path: '/attendance', roles: ['admin','sub_admin','teacher'] },
  { label: 'Academics', path: '/academics', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Timetable', path: '/timetable', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Assignments', path: '/assignments', roles: ['admin','sub_admin','teacher','student'] },
  { label: 'Fees', path: '/fees', roles: ['admin','sub_admin','parent','student'] },
  { label: 'Finance', path: '/finance', roles: ['admin','sub_admin'] },
  { label: 'Library', path: '/library', roles: ['admin','sub_admin','teacher','student'] },
  { label: 'Transport', path: '/transport', roles: ['admin','sub_admin','parent'] },
  { label: 'Inventory', path: '/inventory', roles: ['admin','sub_admin'] },
  { label: 'Discipline', path: '/discipline', roles: ['admin','sub_admin','teacher'] },
  { label: 'Communication', path: '/communication', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Events', path: '/events', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Materials', path: '/materials', roles: ['admin','sub_admin','teacher','student','parent'] },
  { label: 'Settings', path: '/settings', roles: ['admin','sub_admin'] },
];

const MobileNav = () => {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const filtered = navItems.filter(i => role && i.roles.includes(role));

  return (
    <header className="md:hidden flex items-center justify-between p-3 border-b bg-background">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-primary" />
        <span className="font-semibold text-sm">Westfield Academy</span>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="p-4 border-b">
            <p className="font-semibold text-sm">{profile?.full_name}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {filtered.map(item => {
              const Icon = iconMap[item.label] || LayoutDashboard;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn('flex items-center gap-3 px-3 py-2 rounded-md text-sm',
                      isActive ? 'bg-accent font-medium' : 'hover:bg-accent/50')
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={async () => { await signOut(); navigate('/login'); }}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNav;
