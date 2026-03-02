import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('assignments').select('*, classes(name, section), subjects(name)').order('due_date', { ascending: false }),
      supabase.from('assignment_submissions').select('*, assignments(title), students(full_name)').order('submitted_at', { ascending: false }).limit(100),
      supabase.from('classes').select('*').order('name'),
      supabase.from('subjects').select('id, name').order('name'),
    ]).then(([a, s, c, su]) => { setAssignments(a.data || []); setSubmissions(s.data || []); setClasses(c.data || []); setSubjects(su.data || []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const pending = assignments.filter(a => a.status === 'active').length;

  const handleDeleteAssignment = async (id: string) => {
    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); }
  };
  const handleDeleteSubmission = async (id: string) => {
    const { error } = await supabase.from('assignment_submissions').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); }
  };

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ title: '', description: '', class_id: '', subject_id: '', due_date: '', max_marks: '100' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('assignments').insert({ title: form.title, description: form.description || null, class_id: form.class_id || null, subject_id: form.subject_id || null, due_date: form.due_date || null, max_marks: Number(form.max_marks) });
      if (error) toast.error(error.message); else { toast.success('Assignment added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1"><Label>Title *</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Subject</Label><Select value={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Max Marks</Label><Input type="number" value={form.max_marks} onChange={e => setForm(f => ({ ...f, max_marks: e.target.value }))} /></div>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Assignment'}</Button>
    </form>);
  };

  const EditAssignmentForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ title: item.title, description: item.description || '', status: item.status || 'active', due_date: item.due_date || '', max_marks: item.max_marks?.toString() || '100' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('assignments').update({ title: form.title, description: form.description || null, status: form.status, due_date: form.due_date || null, max_marks: Number(form.max_marks) }).eq('id', item.id);
      if (error) toast.error(error.message); else { toast.success('Updated'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1"><Label>Title *</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Max Marks</Label><Input type="number" value={form.max_marks} onChange={e => setForm(f => ({ ...f, max_marks: e.target.value }))} /></div>
      </div>
      <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
    </form>);
  };

  return (
    <ModulePage title="Assignments" description="Manage assignments and submissions" icon={FileText}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Assignments</p><p className="text-2xl font-bold">{assignments.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-amber-600">{pending}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Submissions</p><p className="text-2xl font-bold text-green-600">{submissions.length}</p></CardContent></Card>
        </div>
      </RoleSection>
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="assignments">
          <TabsList><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="submissions">Submissions</TabsTrigger></TabsList>
          <TabsContent value="assignments">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">All Assignments</CardTitle>
              <div className="flex gap-2">
                <ExportButton onClick={() => exportToCSV(assignments.map(a => ({ title: a.title, subject: a.subjects?.name || '', class: a.classes ? `${a.classes.name} ${a.classes.section}` : '', due_date: a.due_date || '', max_marks: a.max_marks, status: a.status })), 'assignments')} />
                <AddDialog title="Add Assignment" triggerLabel="Add Assignment">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog>
              </div>
            </CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : assignments.length === 0 ? <p className="text-sm text-muted-foreground">No assignments found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Due Date</TableHead><TableHead>Max Marks</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{assignments.map(a => <TableRow key={a.id}><TableCell className="font-medium">{a.title}</TableCell><TableCell>{a.subjects?.name || '—'}</TableCell><TableCell>{a.classes ? `${a.classes.name} ${a.classes.section}` : '—'}</TableCell><TableCell className="font-mono text-xs">{a.due_date || '—'}</TableCell><TableCell>{a.max_marks}</TableCell><TableCell><Badge variant="outline" className="capitalize">{a.status}</Badge></TableCell>
              <TableCell><div className="flex gap-1"><EditDialog title="Edit Assignment">{({ onClose }) => <EditAssignmentForm item={a} onClose={onClose} />}</EditDialog><DeleteButton onDelete={() => handleDeleteAssignment(a.id)} itemName={a.title} /></div></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="submissions">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Submissions</CardTitle>
              <ExportButton onClick={() => exportToCSV(submissions.map(s => ({ assignment: s.assignments?.title || '', student: s.students?.full_name || '', submitted: s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '', marks: s.marks ?? '', status: s.status, feedback: s.feedback || '' })), 'submissions')} />
            </CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : submissions.length === 0 ? <p className="text-sm text-muted-foreground">No submissions found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Student</TableHead><TableHead>Submitted</TableHead><TableHead>Marks</TableHead><TableHead>Status</TableHead><TableHead>Feedback</TableHead><TableHead className="w-[60px]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{submissions.map(s => <TableRow key={s.id}><TableCell className="font-medium">{s.assignments?.title || '—'}</TableCell><TableCell>{s.students?.full_name || '—'}</TableCell><TableCell className="font-mono text-xs">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</TableCell><TableCell>{s.marks ?? '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell><TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{s.feedback || '—'}</TableCell>
              <TableCell><DeleteButton onDelete={() => handleDeleteSubmission(s.id)} itemName="submission" /></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['student']}>
        <Card><CardHeader><CardTitle className="text-base">My Assignments</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : assignments.length === 0 ? <p className="text-sm text-muted-foreground">No assignments yet.</p> : (<div className="space-y-3">{assignments.map(a => (<div key={a.id} className="flex justify-between items-center border-b pb-2 last:border-0"><div><p className="font-medium">{a.title}</p><p className="text-xs text-muted-foreground">{a.subjects?.name} — Due: {a.due_date || 'TBD'}</p></div><Badge variant="outline" className="capitalize">{a.status}</Badge></div>))}</div>)}</CardContent></Card>
      </RoleSection>
    </ModulePage>
  );
};

export default AssignmentsPage;
