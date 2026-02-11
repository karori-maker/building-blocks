import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, ClipboardCheck, CreditCard, Package, CalendarDays, Bell, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Students', value: '256', icon: Users, color: 'text-blue-600' },
  { label: 'Total Staff', value: '32', icon: UserCog, color: 'text-green-600' },
  { label: "Today's Attendance", value: '94%', icon: ClipboardCheck, color: 'text-amber-600' },
  { label: 'Pending Fees', value: '$12,450', icon: CreditCard, color: 'text-red-600' },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here's your school overview.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <Card key={s.label}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-muted ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="w-4 h-4" /> Low Stock Alerts</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Printer Paper</span><span className="text-destructive font-medium">3 left</span></div>
          <div className="flex justify-between"><span>Whiteboard Markers</span><span className="text-destructive font-medium">5 left</span></div>
          <div className="flex justify-between"><span>Lab Equipment</span><span className="text-amber-600 font-medium">8 left</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Upcoming Events</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Annual Sports Day</span><span className="text-muted-foreground">Mar 15</span></div>
          <div className="flex justify-between"><span>Parent-Teacher Meeting</span><span className="text-muted-foreground">Mar 20</span></div>
          <div className="flex justify-between"><span>Science Fair</span><span className="text-muted-foreground">Apr 5</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Recent Activities</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>New student enrolled — <span className="font-medium">Emily Carter (Grade 10A)</span></p>
          <p>Fee payment received — <span className="font-medium">$500 from John Smith</span></p>
          <p>Leave approved — <span className="font-medium">Mr. Davis (2 days)</span></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Financial Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Revenue This Month</span><span className="font-medium text-green-600">$45,200</span></div>
          <div className="flex justify-between"><span>Expenses This Month</span><span className="font-medium text-red-600">$32,100</span></div>
          <div className="flex justify-between border-t pt-2"><span className="font-medium">Net</span><span className="font-medium">$13,100</span></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminDashboard;
