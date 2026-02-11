import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ClipboardCheck, FileText, Bell } from 'lucide-react';

const TeacherDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'My Classes', value: '4', icon: BookOpen, color: 'text-blue-600' },
        { label: "Today's Periods", value: '6', icon: ClipboardCheck, color: 'text-green-600' },
        { label: 'Pending Grading', value: '12', icon: FileText, color: 'text-amber-600' },
        { label: 'Announcements', value: '3', icon: Bell, color: 'text-purple-600' },
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
        <CardHeader><CardTitle className="text-base">Today's Schedule</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Period 1 — Mathematics (10A)</span><span className="text-muted-foreground">8:00 AM</span></div>
          <div className="flex justify-between"><span>Period 2 — Mathematics (10B)</span><span className="text-muted-foreground">9:00 AM</span></div>
          <div className="flex justify-between"><span>Period 4 — Algebra (9A)</span><span className="text-muted-foreground">11:00 AM</span></div>
          <div className="flex justify-between"><span>Period 6 — Mathematics (8A)</span><span className="text-muted-foreground">1:00 PM</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Announcements</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Staff meeting on Friday at 3 PM</p>
          <p>Submit mid-term grades by March 10</p>
          <p>New library books available for review</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TeacherDashboard;
