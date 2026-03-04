import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import { Building2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SchoolsPage = () => {
  const { schools, refetch } = useSchool();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('schools').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('School deleted'); refetch(); }
  };

  const AddSchoolForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', academic_year: '2025-2026' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('schools').insert({ name: form.name, email: form.email || null, phone: form.phone || null, address: form.address || null, academic_year: form.academic_year });
      if (error) toast.error(error.message); else { toast.success('School added'); onClose(); refetch(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>School Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academic_year} onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add School'}</Button>
      </form>
    );
  };

  const EditSchoolForm = ({ school, onClose }: { school: any; onClose: () => void }) => {
    const [form, setForm] = useState({ name: school.name, email: school.email || '', phone: school.phone || '', address: school.address || '', academic_year: school.academic_year || '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('schools').update({ name: form.name, email: form.email || null, phone: form.phone || null, address: form.address || null, academic_year: form.academic_year }).eq('id', school.id);
      if (error) toast.error(error.message); else { toast.success('School updated'); onClose(); refetch(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>School Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academic_year} onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    );
  };

  // Sub-admin creation form
  const CreateSubAdminForm = ({ school, onClose }: { school: any; onClose: () => void }) => {
    const [form, setForm] = useState({ email: '', password: '', full_name: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { data, error } = await supabase.functions.invoke('create-sub-admin', {
        body: { email: form.email, password: form.password, full_name: form.full_name, school_id: school.id },
      });
      if (error || data?.error) toast.error(data?.error || error?.message || 'Failed');
      else { toast.success('Sub-admin created! Login credentials sent.'); onClose(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <p className="text-sm text-muted-foreground">Creating sub-admin for <strong>{school.name}</strong></p>
        <div className="space-y-1"><Label>Full Name *</Label><Input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Temporary Password *</Label><Input type="password" required minLength={6} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Creating...' : 'Create Sub-Admin Account'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Schools" description="Manage schools and sub-admin accounts" icon={Building2}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Schools</p><p className="text-2xl font-bold">{schools.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{schools.length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="schools">
          <TabsList>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="sub-admins">Sub-Admins</TabsTrigger>
          </TabsList>
          <TabsContent value="schools">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">All Schools</CardTitle>
                <AddDialog title="Add School" triggerLabel="Add School">{({ onClose }) => <AddSchoolForm onClose={onClose} />}</AddDialog>
              </CardHeader>
              <CardContent>
                {schools.length === 0 ? <p className="text-sm text-muted-foreground">No schools added yet. Add your first school to get started.</p> : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Year</TableHead><TableHead className="w-[140px]">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>{schools.map(s => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{s.email || '—'}</TableCell>
                          <TableCell>{s.phone || '—'}</TableCell>
                          <TableCell><Badge variant="outline">{s.academic_year}</Badge></TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <EditDialog title="Edit School">{({ onClose }) => <EditSchoolForm school={s} onClose={onClose} />}</EditDialog>
                              <DeleteButton onDelete={() => handleDelete(s.id)} itemName={s.name} />
                              <AddDialog title="Add Sub-Admin" triggerLabel="">
                                {({ onClose }) => <CreateSubAdminForm school={s} onClose={onClose} />}
                              </AddDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}</TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sub-admins">
            <Card>
              <CardHeader><CardTitle className="text-base">Sub-Admin Accounts</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Sub-admins can be created from the Schools tab by clicking the user icon next to each school. They will receive login credentials via email and can manage only their assigned school.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
    </ModulePage>
  );
};

export default SchoolsPage;
