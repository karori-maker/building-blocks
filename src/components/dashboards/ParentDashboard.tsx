import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, BookOpen, CreditCard, Bell } from 'lucide-react';

const ParentDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Parent Dashboard</h1>
      <p className="text-muted-foreground">Your child's school overview.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Attendance', value: '92%', icon: ClipboardCheck, color: 'text-green-600' },
        { label: 'GPA', value: '3.6', icon: BookOpen, color: 'text-blue-600' },
        { label: 'Fee Status', value: 'Paid', icon: CreditCard, color: 'text-green-600' },
        { label: 'Notifications', value: '2', icon: Bell, color: 'text-amber-600' },
      ].map(s => (
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
        <CardHeader><CardTitle className="text-base">Attendance Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Total Days</span><span>180</span></div>
          <div className="flex justify-between"><span>Present</span><span className="text-green-600">166</span></div>
          <div className="flex justify-between"><span>Absent</span><span className="text-red-600">14</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Announcements</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Parent-Teacher meeting scheduled for March 20</p>
          <p>Annual sports day on March 15</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ParentDashboard;
