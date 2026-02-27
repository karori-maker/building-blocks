import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('students').select('*, classes(name, section)').order('full_name'),
      supabase.from('classes').select('*').order('name'),
    ]).then(([s, c]) => {
      setStudents(s.data || []);
      setClasses(c.data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalInactive = students.filter(s => s.status !== 'active').length;
  const genderCounts = students.reduce((acc: Record<string, number>, s) => {
    const g = s.gender || 'Unknown';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const AddStudentForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', full_name: '', gender: 'male', class_id: '', roll_number: '', email: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      const { error } = await supabase.from('students').insert({ ...form, class_id: form.class_id || null });
      if (error) toast.error(error.message);
      else { toast.success('Student added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Student ID *</Label><Input required value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Gender</Label>
            <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1"><Label>Class</Label>
            <Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1"><Label>Roll Number</Label><Input value={form.roll_number} onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Students" description="Manage student records and profiles" icon={Users}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{totalActive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Inactive</p><p className="text-2xl font-bold text-destructive">{totalInactive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Gender Breakdown</p><div className="flex gap-2 mt-1">{Object.entries(genderCounts).map(([g, c]) => <Badge key={g} variant="secondary" className="capitalize">{g}: {String(c)}</Badge>)}</div></CardContent></Card>
        </div>
      </RoleSection>

      <RoleSection roles={['admin', 'teacher']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Student List</CardTitle>
            <RoleSection roles={['admin']}><AddDialog title="Add Student" triggerLabel="Add Student">{({ onClose }) => <AddStudentForm onClose={onClose} />}</AddDialog></RoleSection>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : students.length === 0 ? <p className="text-sm text-muted-foreground">No students found.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>{students.map(s => (
                    <TableRow key={s.id}><TableCell className="font-mono text-xs">{s.student_id}</TableCell><TableCell className="font-medium">{s.full_name}</TableCell><TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : '—'}</TableCell><TableCell className="capitalize">{s.gender || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell></TableRow>
                  ))}</TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default StudentsPage;
