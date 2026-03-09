import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { ClipboardCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const statusColor: Record<string, string> = { present: 'bg-green-100 text-green-800', absent: 'bg-red-100 text-red-800', late: 'bg-yellow-100 text-yellow-800', 'half-day': 'bg-orange-100 text-orange-800' };

const AttendancePage = () => {
  const { currentSchool } = useSchool();
  const [records, setRecords] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchRecords = () => {
    setLoading(true);
    let query = supabase.from('attendance').select('*, students(full_name, student_id), classes(name, section)').order('date', { ascending: false }).limit(100);
    if (selectedClass !== 'all') query = query.eq('class_id', selectedClass);
    query.then(({ data }) => { setRecords(data || []); setLoading(false); });
  };

  useEffect(() => {
    supabase.from('classes').select('id, name, section').order('name').then(({ data }) => setClasses(data || []));
    supabase.from('students').select('id, full_name, student_id').order('full_name').then(({ data }) => setStudents(data || []));
  }, []);
  useEffect(() => { fetchRecords(); }, [selectedClass]);

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const rate = records.length > 0 ? ((presentCount / records.length) * 100).toFixed(1) : '0';

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('attendance').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Record deleted'); fetchRecords(); }
  };

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', class_id: '', date: new Date().toISOString().split('T')[0], status: 'present', remarks: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('attendance').insert({ student_id: form.student_id, class_id: form.class_id || null, date: form.date, status: form.status, remarks: form.remarks || null });
      if (error) toast.error(error.message); else { toast.success('Attendance recorded'); onClose(); fetchRecords(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1"><Label>Student *</Label><Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Date *</Label><Input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Status *</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="half-day">Half Day</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label>Remarks</Label><Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
      </div>
      <Button type="submit" className="w-full" disabled={saving || !form.student_id}>{saving ? 'Saving...' : 'Record Attendance'}</Button>
    </form>);
  };

  const EditForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ status: item.status, remarks: item.remarks || '', date: item.date });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('attendance').update({ status: form.status, remarks: form.remarks || null, date: form.date }).eq('id', item.id);
      if (error) toast.error(error.message); else { toast.success('Updated'); onClose(); fetchRecords(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="half-day">Half Day</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
      </div>
      <div className="space-y-1"><Label>Remarks</Label><Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
      <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
    </form>);
  };

  return (
    <ModulePage title="Attendance" description="Mark and manage daily attendance" icon={ClipboardCheck}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Records</p><p className="text-2xl font-bold">{records.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-bold text-green-600">{presentCount}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Absent</p><p className="text-2xl font-bold text-destructive">{absentCount}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Attendance Rate</p><p className="text-2xl font-bold">{rate}%</p></CardContent></Card>
        </div>
      </RoleSection>
      <RoleSection roles={['admin', 'teacher']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Attendance Records</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by class" /></SelectTrigger><SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select>
              <ExportButton onClick={() => exportToCSV(records.map(r => ({ date: r.date, student: r.students?.full_name || '', class: r.classes ? `${r.classes.name} ${r.classes.section}` : '', status: r.status, remarks: r.remarks || '' })), 'attendance')} />
              <RoleSection roles={['admin', 'teacher']}><AddDialog title="Record Attendance" triggerLabel="Mark Attendance">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog></RoleSection>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : records.length === 0 ? <p className="text-sm text-muted-foreground">No attendance records found.</p> : (
              <div className="overflow-x-auto">
                <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Status</TableHead><TableHead>Remarks</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
                <TableBody>{records.map(r => (<TableRow key={r.id}><TableCell className="font-mono text-xs">{r.date}</TableCell><TableCell className="font-medium">{r.students?.full_name || '—'}</TableCell><TableCell>{r.classes ? `${r.classes.name} ${r.classes.section}` : '—'}</TableCell><TableCell><Badge variant="outline" className={statusColor[r.status] || ''}>{r.status}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{r.remarks || '—'}</TableCell>
                <TableCell><div className="flex gap-1"><EditDialog title="Edit Attendance">{({ onClose }) => <EditForm item={r} onClose={onClose} />}</EditDialog><DeleteButton onDelete={() => handleDelete(r.id)} itemName="record" /></div></TableCell></TableRow>))}</TableBody></Table>
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default AttendancePage;
