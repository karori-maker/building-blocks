import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const StaffPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { setLoading(true); supabase.from('staff').select('*').order('full_name').then(({ data }) => { setStaff(data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const totalActive = staff.filter(s => s.status === 'active').length;
  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ employee_id: '', full_name: '', designation: '', department: '', qualification: '', email: '', salary: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('staff').insert({ ...form, salary: form.salary ? Number(form.salary) : null });
      if (error) toast.error(error.message); else { toast.success('Staff added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Employee ID *</Label><Input required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Designation</Label><Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Department</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Qualification</Label><Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Salary</Label><Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Staff'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Staff" description="Manage staff records" icon={UserCog}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Staff</p><p className="text-2xl font-bold">{staff.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active Staff</p><p className="text-2xl font-bold text-green-600">{totalActive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Departments</p><div className="flex flex-wrap gap-1 mt-1">{departments.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}</div></CardContent></Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Staff List</CardTitle>
            <AddDialog title="Add Staff" triggerLabel="Add Staff">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : staff.length === 0 ? <p className="text-sm text-muted-foreground">No staff found.</p> : (
              <div className="overflow-x-auto">
                <Table><TableHeader><TableRow><TableHead>Employee ID</TableHead><TableHead>Name</TableHead><TableHead>Designation</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>{staff.map(s => (<TableRow key={s.id}><TableCell className="font-mono text-xs">{s.employee_id}</TableCell><TableCell className="font-medium">{s.full_name}</TableCell><TableCell>{s.designation || '—'}</TableCell><TableCell>{s.department || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell></TableRow>))}</TableBody></Table>
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default StaffPage;
