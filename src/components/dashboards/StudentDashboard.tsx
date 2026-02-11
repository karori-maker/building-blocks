import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardCheck, FileText, CreditCard } from 'lucide-react';

const StudentDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
      <p className="text-muted-foreground">Here's your academic overview.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Attendance', value: '92%', icon: ClipboardCheck, color: 'text-green-600' },
        { label: 'GPA', value: '3.6', icon: BookOpen, color: 'text-blue-600' },
        { label: 'Pending Assignments', value: '3', icon: FileText, color: 'text-amber-600' },
        { label: 'Fee Status', value: 'Paid', icon: CreditCard, color: 'text-green-600' },
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
        <CardHeader><CardTitle className="text-base">Today's Timetable</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Period 1 — Mathematics</span><span className="text-muted-foreground">8:00 AM</span></div>
          <div className="flex justify-between"><span>Period 2 — English</span><span className="text-muted-foreground">9:00 AM</span></div>
          <div className="flex justify-between"><span>Period 3 — Science</span><span className="text-muted-foreground">10:00 AM</span></div>
          <div className="flex justify-between"><span>Period 4 — History</span><span className="text-muted-foreground">11:00 AM</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Grades</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Mathematics — Quiz 3</span><span className="font-medium">A</span></div>
          <div className="flex justify-between"><span>English — Essay</span><span className="font-medium">B+</span></div>
          <div className="flex justify-between"><span>Science — Lab Report</span><span className="font-medium">A-</span></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default StudentDashboard;
