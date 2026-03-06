import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Users, UserCog, ClipboardCheck, CreditCard, TrendingUp, CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(262, 83%, 58%)'];

const AdminDashboard = () => {
  const { role } = useAuth();
  const { currentSchool } = useSchool();
  const [stats, setStats] = useState({ students: 0, staff: 0, attendance: 0, pendingFees: 0 });
  const [classData, setClassData] = useState<any[]>([]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const schoolName = role === 'sub_admin' && currentSchool ? currentSchool.name : 'Academic Hub';

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [studentsRes, staffRes, attendanceRes, feesRes, eventsRes, financeRes, classesRes] = await Promise.all([
        supabase.from('students').select('id, gender, class_id, status').eq('status', 'active'),
        supabase.from('staff').select('id, status').eq('status', 'active'),
        supabase.from('attendance').select('id, status, date').gte('date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
        supabase.from('fee_payments').select('amount_paid, status').eq('status', 'pending'),
        supabase.from('events').select('id, title, start_date').gte('start_date', new Date().toISOString().split('T')[0]).order('start_date').limit(5),
        supabase.from('finance_transactions').select('amount, type, date, category').order('date', { ascending: false }).limit(30),
        supabase.from('classes').select('id, name, section'),
      ]);

      const students = studentsRes.data || [];
      const staffList = staffRes.data || [];
      const attendanceList = attendanceRes.data || [];
      const fees = feesRes.data || [];
      const classes = classesRes.data || [];

      // Stats
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAttendance = attendanceList.filter(a => a.date === todayStr);
      const presentToday = todayAttendance.filter(a => a.status === 'present').length;
      const attendancePct = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 0;
      const pendingTotal = fees.reduce((s, f) => s + Number(f.amount_paid || 0), 0);

      setStats({
        students: students.length,
        staff: staffList.length,
        attendance: attendancePct,
        pendingFees: pendingTotal,
      });

      // Class enrollment chart
      const classMap = new Map(classes.map(c => [c.id, `${c.name} ${c.section}`]));
      const classCounts: Record<string, number> = {};
      students.forEach(s => {
        const name = classMap.get(s.class_id) || 'Unassigned';
        classCounts[name] = (classCounts[name] || 0) + 1;
      });
      setClassData(Object.entries(classCounts).map(([name, count]) => ({ name, students: count })));

      // Gender pie
      const genderCounts: Record<string, number> = {};
      students.forEach(s => { const g = s.gender || 'Unknown'; genderCounts[g] = (genderCounts[g] || 0) + 1; });
      setGenderData(Object.entries(genderCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })));

      // Weekly attendance trend
      const dayMap: Record<string, { present: number; total: number }> = {};
      attendanceList.forEach(a => {
        if (!dayMap[a.date]) dayMap[a.date] = { present: 0, total: 0 };
        dayMap[a.date].total++;
        if (a.status === 'present') dayMap[a.date].present++;
      });
      setAttendanceData(Object.entries(dayMap).sort().map(([date, d]) => ({
        date: new Date(date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
        rate: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
      })));

      setRecentEvents(eventsRes.data || []);

      // Finance summary
      const finTx = financeRes.data || [];
      const incomeByCategory: Record<string, number> = {};
      const expenseByCategory: Record<string, number> = {};
      finTx.forEach(t => {
        if (t.type === 'income') incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + Number(t.amount);
        else expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount);
      });
      const totalIncome = Object.values(incomeByCategory).reduce((s, v) => s + v, 0);
      const totalExpense = Object.values(expenseByCategory).reduce((s, v) => s + v, 0);
      setFinanceData([
        { name: 'Income', value: totalIncome },
        { name: 'Expenses', value: totalExpense },
        { name: 'Net', value: totalIncome - totalExpense },
      ]);

      setLoading(false);
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Total Staff', value: stats.staff, icon: UserCog, gradient: 'from-emerald-500 to-emerald-600' },
    { label: "Today's Attendance", value: `${stats.attendance}%`, icon: ClipboardCheck, gradient: 'from-amber-500 to-amber-600' },
    { label: 'Pending Fees', value: `$${stats.pendingFees.toLocaleString()}`, icon: CreditCard, gradient: 'from-rose-500 to-rose-600' },
  ];

  if (loading) return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{schoolName}</h1>
        <p className="text-muted-foreground">Welcome back! Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enrollment by Class */}
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Students by Class</CardTitle></CardHeader>
          <CardContent>
            {classData.length === 0 ? <p className="text-sm text-muted-foreground">No enrollment data yet.</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            {genderData.length === 0 ? <p className="text-sm text-muted-foreground">No student data yet.</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-primary" /> Weekly Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            {attendanceData.length === 0 ? <p className="text-sm text-muted-foreground">No attendance data this week.</p> : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Finance Summary */}
        <Card className="shadow-sm border-border/50">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Financial Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {financeData.map(f => (
              <div key={f.name} className={`flex justify-between items-center p-2.5 rounded-lg ${f.name === 'Net' ? 'bg-primary/5 border border-primary/10' : 'bg-muted/50'}`}>
                <span className={f.name === 'Net' ? 'font-semibold' : ''}>{f.name}</span>
                <span className={`font-semibold ${f.name === 'Income' ? 'text-emerald-600' : f.name === 'Expenses' ? 'text-destructive' : 'text-primary'}`}>
                  ${f.value.toLocaleString()}
                </span>
              </div>
            ))}
            {financeData.length === 0 && <p className="text-muted-foreground">No financial data yet.</p>}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm border-border/50 lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recentEvents.length === 0 ? <p className="text-muted-foreground">No upcoming events.</p> : recentEvents.map(e => (
              <div key={e.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                <span>{e.title}</span>
                <span className="text-muted-foreground text-xs font-mono">{new Date(e.start_date).toLocaleDateString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
