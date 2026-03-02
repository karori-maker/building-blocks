import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const severityColor: Record<string, string> = { minor: 'bg-yellow-100 text-yellow-800', moderate: 'bg-orange-100 text-orange-800', major: 'bg-red-100 text-red-800' };

const DisciplinePage = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = () => { setLoading(true); Promise.all([supabase.from('discipline_incidents').select('*, students(full_name)').order('date', { ascending: false }).limit(100), supabase.from('students').select('id, full_name').order('full_name')]).then(([i, s]) => { setIncidents(i.data || []); setStudents(s.data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);
  const openCount = incidents.filter(i => i.status === 'open').length;
  const handleDelete = async (id: string) => { const { error } = await supabase.from('discipline_incidents').delete().eq('id', id); if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); } };

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', description: '', severity: 'minor', action_taken: '', date: new Date().toISOString().split('T')[0] });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('discipline_incidents').insert({ student_id: form.student_id, description: form.description, severity: form.severity, action_taken: form.action_taken || null, date: form.date }); if (error) toast.error(error.message); else { toast.success('Incident recorded'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Student *</Label><Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1"><Label>Description *</Label><Textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Severity</Label><Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="minor">Minor</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="major">Major</SelectItem></SelectContent></Select></div><div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div></div><div className="space-y-1"><Label>Action Taken</Label><Input value={form.action_taken} onChange={e => setForm(f => ({ ...f, action_taken: e.target.value }))} /></div><Button type="submit" className="w-full" disabled={saving || !form.student_id}>{saving ? 'Saving...' : 'Record Incident'}</Button></form>);
  };

  const EditForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ description: item.description, severity: item.severity || 'minor', action_taken: item.action_taken || '', status: item.status || 'open', date: item.date });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('discipline_incidents').update({ description: form.description, severity: form.severity, action_taken: form.action_taken || null, status: form.status, date: form.date }).eq('id', item.id); if (error) toast.error(error.message); else { toast.success('Updated'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Severity</Label><Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="minor">Minor</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="major">Major</SelectItem></SelectContent></Select></div><div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select></div></div><div className="space-y-1"><Label>Action Taken</Label><Input value={form.action_taken} onChange={e => setForm(f => ({ ...f, action_taken: e.target.value }))} /></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button></form>);
  };

  return (
    <ModulePage title="Discipline" description="Incident tracking and management" icon={Shield}>
      <RoleSection roles={['admin']}><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Incidents</p><p className="text-2xl font-bold">{incidents.length}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open</p><p className="text-2xl font-bold text-destructive">{openCount}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Resolved</p><p className="text-2xl font-bold text-green-600">{incidents.length - openCount}</p></CardContent></Card></div></RoleSection>
      <RoleSection roles={['admin', 'teacher']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Discipline Incidents</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(incidents.map(i => ({ date: i.date, student: i.students?.full_name || '', description: i.description, severity: i.severity, action: i.action_taken || '', status: i.status })), 'discipline')} /><AddDialog title="Record Incident" triggerLabel="Add Incident">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog></div></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : incidents.length === 0 ? <p className="text-sm text-muted-foreground">No incidents found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Student</TableHead><TableHead>Description</TableHead><TableHead>Severity</TableHead><TableHead>Action Taken</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{incidents.map(i => <TableRow key={i.id}><TableCell className="font-mono text-xs">{i.date}</TableCell><TableCell className="font-medium">{i.students?.full_name || '—'}</TableCell><TableCell className="text-sm max-w-[250px] truncate">{i.description}</TableCell><TableCell><Badge variant="outline" className={severityColor[i.severity] || ''}>{i.severity}</Badge></TableCell><TableCell className="text-sm">{i.action_taken || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell>
            <TableCell><div className="flex gap-1"><EditDialog title="Edit Incident">{({ onClose }) => <EditForm item={i} onClose={onClose} />}</EditDialog><DeleteButton onDelete={() => handleDelete(i.id)} itemName="incident" /></div></TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default DisciplinePage;
