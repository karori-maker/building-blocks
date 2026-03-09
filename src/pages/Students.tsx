import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('students').select('*, classes(name, section)').order('full_name'),
      supabase.from('classes').select('*').order('name'),
    ]).then(([s, c]) => { setStudents(s.data || []); setClasses(c.data || []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalInactive = students.filter(s => s.status !== 'active').length;
  const genderCounts = students.reduce((acc: Record<string, number>, s) => { const g = s.gender || 'Unknown'; acc[g] = (acc[g] || 0) + 1; return acc; }, {});

  const groupedByClass = classes.map(c => ({ ...c, label: `${c.name} ${c.section}`, students: students.filter(s => s.class_id === c.id) })).filter(g => g.students.length > 0);
  const unassigned = students.filter(s => !s.class_id);

  const exportStudents = (list: any[], label: string) => {
    exportToCSV(list.map(s => ({ student_id: s.student_id, full_name: s.full_name, class: s.classes ? `${s.classes.name} ${s.classes.section}` : '', gender: s.gender || '', email: s.email || '', phone: s.phone || '', roll_number: s.roll_number || '', status: s.status || '' })), `students_${label}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Student deleted'); fetchData(); }
  };

  const AddStudentForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', full_name: '', gender: 'male', class_id: '', roll_number: '', email: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('students').insert({ ...form, class_id: form.class_id || null });
      if (error) toast.error(error.message); else { toast.success('Student added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Student ID *</Label><Input required value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Gender</Label><Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Roll Number</Label><Input value={form.roll_number} onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Student'}</Button>
      </form>
    );
  };

  const EditStudentForm = ({ student, onClose }: { student: any; onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: student.student_id, full_name: student.full_name, gender: student.gender || 'male', class_id: student.class_id || '', roll_number: student.roll_number || '', email: student.email || '', status: student.status || 'active' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('students').update({ ...form, class_id: form.class_id || null }).eq('id', student.id);
      if (error) toast.error(error.message); else { toast.success('Student updated'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Student ID *</Label><Input required value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Gender</Label><Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Roll Number</Label><Input value={form.roll_number} onChange={e => setForm(f => ({ ...f, roll_number: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="graduated">Graduated</SelectItem></SelectContent></Select></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    );
  };

  // Create Account Form
  const CreateAccountForm = ({ student, onClose }: { student: any; onClose: () => void }) => {
    const [form, setForm] = useState({ email: student.email || '', password: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { data, error } = await supabase.functions.invoke('create-student-account', {
        body: { email: form.email, password: form.password, full_name: student.full_name, student_id: student.student_id },
      });
      if (error || data?.error) toast.error(data?.error || error?.message || 'Failed to create account');
      else { toast.success('Account created! Verification email sent.'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-muted-foreground">Creating account for <strong>{student.full_name}</strong> (Reg: {student.student_id})</p>
        <div className="space-y-1"><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Temporary Password *</Label><Input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Creating...' : 'Create Account & Send Email'}</Button>
      </form>
    );
  };

  const StudentTable = ({ list }: { list: any[] }) => (
    <Table>
      <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Actions</TableHead></TableRow></TableHeader>
      <TableBody>{list.map(s => (
        <TableRow key={s.id}>
          <TableCell className="font-mono text-xs">{s.student_id}</TableCell>
          <TableCell className="font-medium">{s.full_name}</TableCell>
          <TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : '—'}</TableCell>
          <TableCell className="capitalize">{s.gender || '—'}</TableCell>
          <TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell>
          <TableCell>
            <RoleSection roles={['admin']}>
              <div className="flex gap-1">
                <EditDialog title="Edit Student">{({ onClose }) => <EditStudentForm student={s} onClose={onClose} />}</EditDialog>
                <DeleteButton onDelete={() => handleDelete(s.id)} itemName={s.full_name} />
                {!s.user_id && (
                  <AddDialog title="Create Account" triggerLabel="">{({ onClose }) => <CreateAccountForm student={s} onClose={onClose} />}</AddDialog>
                )}
              </div>
            </RoleSection>
          </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  );

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
        <Tabs defaultValue="all">
          <TabsList><TabsTrigger value="all">All Students</TabsTrigger><TabsTrigger value="by-class">By Class</TabsTrigger></TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Student List</CardTitle>
                <div className="flex gap-2">
                  <ExportButton onClick={() => exportStudents(students, 'all')} />
                  <RoleSection roles={['admin']}><AddDialog title="Add Student" triggerLabel="Add Student">{({ onClose }) => <AddStudentForm onClose={onClose} />}</AddDialog></RoleSection>
                </div>
              </CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : students.length === 0 ? <p className="text-sm text-muted-foreground">No students found.</p> : (<div className="overflow-x-auto"><StudentTable list={students} /></div>)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="by-class">
            <div className="space-y-4">
              {groupedByClass.map(g => (
                <Card key={g.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">{g.label} <Badge variant="secondary" className="ml-2">{g.students.length} students</Badge></CardTitle>
                    <ExportButton onClick={() => exportStudents(g.students, g.label.replace(/\s+/g, '_'))} label={`Export ${g.label}`} />
                  </CardHeader>
                  <CardContent><div className="overflow-x-auto"><StudentTable list={g.students} /></div></CardContent>
                </Card>
              ))}
              {unassigned.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">Unassigned <Badge variant="secondary" className="ml-2">{unassigned.length} students</Badge></CardTitle>
                    <ExportButton onClick={() => exportStudents(unassigned, 'unassigned')} />
                  </CardHeader>
                  <CardContent><div className="overflow-x-auto"><StudentTable list={unassigned} /></div></CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </RoleSection>
    </ModulePage>
  );
};

export default StudentsPage;
