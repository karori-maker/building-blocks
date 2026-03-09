import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { UserCog, UserPlus } from 'lucide-react';
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

const StaffPage = () => {
  const { currentSchool } = useSchool();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { setLoading(true); supabase.from('staff').select('*').order('full_name').then(({ data }) => { setStaff(data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const totalActive = staff.filter(s => s.status === 'active').length;
  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];
  const groupedByDept = departments.map(d => ({ department: d, members: staff.filter(s => s.department === d) }));
  const noDept = staff.filter(s => !s.department);

  const exportStaff = (list: any[], label: string) => {
    exportToCSV(list.map(s => ({ employee_id: s.employee_id, full_name: s.full_name, designation: s.designation || '', department: s.department || '', qualification: s.qualification || '', email: s.email || '', phone: s.phone || '', status: s.status || '' })), `staff_${label}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Staff deleted'); fetchData(); }
  };

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ employee_id: '', full_name: '', designation: '', department: '', qualification: '', email: '', salary: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('staff').insert({ ...form, salary: form.salary ? Number(form.salary) : null });
      if (error) toast.error(error.message); else { toast.success('Staff added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="grid grid-cols-2 gap-3">
      <div className="space-y-1"><Label>Employee ID *</Label><Input required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Designation</Label><Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Department</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Qualification</Label><Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Salary</Label><Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
    </div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Staff'}</Button></form>);
  };

  const EditForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ employee_id: item.employee_id, full_name: item.full_name, designation: item.designation || '', department: item.department || '', qualification: item.qualification || '', email: item.email || '', salary: item.salary?.toString() || '', status: item.status || 'active' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('staff').update({ ...form, salary: form.salary ? Number(form.salary) : null }).eq('id', item.id);
      if (error) toast.error(error.message); else { toast.success('Staff updated'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="grid grid-cols-2 gap-3">
      <div className="space-y-1"><Label>Employee ID *</Label><Input required value={form.employee_id} onChange={e => setForm(f => ({ ...f, employee_id: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Designation</Label><Input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Department</Label><Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Qualification</Label><Input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Salary</Label><Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} /></div>
      <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
    </div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button></form>);
  };

  // Create Account Form for any staff member
  const CreateStaffAccountForm = ({ staffMember, onClose }: { staffMember: any; onClose: () => void }) => {
    const [form, setForm] = useState({ email: staffMember.email || '', password: '', role: 'teacher' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { data, error } = await supabase.functions.invoke('create-staff-account', {
        body: { email: form.email, password: form.password, full_name: staffMember.full_name, employee_id: staffMember.employee_id, role: form.role },
      });
      if (error || data?.error) toast.error(data?.error || error?.message || 'Failed to create account');
      else { toast.success(`Account created for ${staffMember.full_name} as ${form.role}!`); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-muted-foreground">Creating account for <strong>{staffMember.full_name}</strong> (ID: {staffMember.employee_id})</p>
        <div className="space-y-1"><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Role *</Label>
          <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Temporary Password *</Label><Input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Creating...' : 'Create Account'}</Button>
      </form>
    );
  };

  const StaffTable = ({ list }: { list: any[] }) => (
    <Table><TableHeader><TableRow><TableHead>Employee ID</TableHead><TableHead>Name</TableHead><TableHead>Designation</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Account</TableHead><TableHead className="w-[120px]">Actions</TableHead></TableRow></TableHeader>
    <TableBody>{list.map(s => (<TableRow key={s.id}><TableCell className="font-mono text-xs">{s.employee_id}</TableCell><TableCell className="font-medium">{s.full_name}</TableCell><TableCell>{s.designation || '—'}</TableCell><TableCell>{s.department || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell>
    <TableCell>{s.user_id ? <Badge variant="secondary" className="text-xs">Active</Badge> : <Badge variant="outline" className="text-xs text-muted-foreground">No Account</Badge>}</TableCell>
    <TableCell><div className="flex gap-1">
      <EditDialog title="Edit Staff">{({ onClose }) => <EditForm item={s} onClose={onClose} />}</EditDialog>
      <DeleteButton onDelete={() => handleDelete(s.id)} itemName={s.full_name} />
      {!s.user_id && (
        <AddDialog title="Create Account" triggerLabel="">
          {({ onClose }) => <CreateStaffAccountForm staffMember={s} onClose={onClose} />}
        </AddDialog>
      )}
    </div></TableCell></TableRow>))}</TableBody></Table>
  );

  return (
    <ModulePage title="Staff" description="Manage staff records and accounts" icon={UserCog}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Staff</p><p className="text-2xl font-bold">{staff.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active Staff</p><p className="text-2xl font-bold text-emerald-600">{totalActive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">With Accounts</p><p className="text-2xl font-bold text-primary">{staff.filter(s => s.user_id).length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Staff</TabsTrigger>
            <TabsTrigger value="by-dept">By Department</TabsTrigger>
            <TabsTrigger value="accounts">Account Management</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Staff List</CardTitle>
                <div className="flex gap-2">
                  <ExportButton onClick={() => exportStaff(staff, 'all')} />
                  <AddDialog title="Add Staff" triggerLabel="Add Staff">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : staff.length === 0 ? <p className="text-sm text-muted-foreground">No staff found.</p> : (
                  <div className="overflow-x-auto"><StaffTable list={staff} /></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-dept">
            <div className="space-y-4">
              {groupedByDept.map(g => (
                <Card key={g.department}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">{g.department} <Badge variant="secondary" className="ml-2">{g.members.length}</Badge></CardTitle>
                    <ExportButton onClick={() => exportStaff(g.members, g.department.replace(/\s+/g, '_'))} />
                  </CardHeader>
                  <CardContent><div className="overflow-x-auto"><StaffTable list={g.members} /></div></CardContent>
                </Card>
              ))}
              {noDept.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base">No Department <Badge variant="secondary" className="ml-2">{noDept.length}</Badge></CardTitle>
                    <ExportButton onClick={() => exportStaff(noDept, 'no_department')} />
                  </CardHeader>
                  <CardContent><div className="overflow-x-auto"><StaffTable list={noDept} /></div></CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><UserPlus className="w-4 h-4" /> Staff Account Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Staff members without accounts are listed below. Click the user icon in the Actions column to create a login account for them.</p>
                {staff.filter(s => !s.user_id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">All staff members have accounts.</p>
                ) : (
                  <div className="overflow-x-auto"><StaffTable list={staff.filter(s => !s.user_id)} /></div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
    </ModulePage>
  );
};

export default StaffPage;
