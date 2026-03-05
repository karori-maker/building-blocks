import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Users, UserCog, ClipboardCheck, CreditCard, Package, CalendarDays, Bell, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Students', value: '256', icon: Users, gradient: 'from-blue-500 to-blue-600' },
  { label: 'Total Staff', value: '32', icon: UserCog, gradient: 'from-emerald-500 to-emerald-600' },
  { label: "Today's Attendance", value: '94%', icon: ClipboardCheck, gradient: 'from-amber-500 to-amber-600' },
  { label: 'Pending Fees', value: '$12,450', icon: CreditCard, gradient: 'from-rose-500 to-rose-600' },
];

const AdminDashboard = () => {
  const { role } = useAuth();
  const { currentSchool } = useSchool();
  
  const schoolName = role === 'sub_admin' && currentSchool ? currentSchool.name : 'Academic Hub';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{schoolName}</h1>
        <p className="text-muted-foreground">Welcome back! Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg bg-destructive/5"><span>Printer Paper</span><span className="text-destructive font-semibold text-xs px-2 py-0.5 bg-destructive/10 rounded-full">3 left</span></div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-destructive/5"><span>Whiteboard Markers</span><span className="text-destructive font-semibold text-xs px-2 py-0.5 bg-destructive/10 rounded-full">5 left</span></div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-warning/5"><span>Lab Equipment</span><span className="font-semibold text-xs px-2 py-0.5 bg-warning/10 rounded-full" style={{ color: 'hsl(38 92% 50%)' }}>8 left</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50"><span>Annual Sports Day</span><span className="text-muted-foreground text-xs">Mar 15</span></div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50"><span>Parent-Teacher Meeting</span><span className="text-muted-foreground text-xs">Mar 20</span></div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50"><span>Science Fair</span><span className="text-muted-foreground text-xs">Apr 5</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Recent Activities</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="p-2 rounded-lg bg-muted/50">New student enrolled — <span className="font-medium">Emily Carter (Grade 10A)</span></div>
            <div className="p-2 rounded-lg bg-muted/50">Fee payment received — <span className="font-medium">$500 from John Smith</span></div>
            <div className="p-2 rounded-lg bg-muted/50">Leave approved — <span className="font-medium">Mr. Davis (2 days)</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Financial Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50"><span>Revenue This Month</span><span className="font-semibold" style={{ color: 'hsl(142 71% 45%)' }}>$45,200</span></div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50"><span>Expenses This Month</span><span className="font-semibold text-destructive">$32,100</span></div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-primary/5 border border-primary/10"><span className="font-semibold">Net</span><span className="font-bold text-primary">$13,100</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
