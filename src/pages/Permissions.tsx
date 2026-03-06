import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { Shield, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PermissionsPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const { data: profiles } = await supabase.from('profiles').select('user_id, full_name, email');

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
    const userList = (roles || []).map(r => ({
      ...r,
      full_name: profileMap.get(r.user_id)?.full_name || 'Unknown',
      email: profileMap.get(r.user_id)?.email || '',
    }));
    setUsers(userList);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase.from('user_roles').update({ role: newRole as any }).eq('user_id', userId);
    if (error) toast.error(error.message);
    else { toast.success('Role updated'); fetchUsers(); }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary/10 text-primary border-primary/20';
      case 'sub_admin': return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
      case 'teacher': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'student': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'parent': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return '';
    }
  };

  return (
    <ModulePage title="Permissions" description="Manage user roles and access control" icon={Shield}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold">{users.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Admins</p><p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Teachers</p><p className="text-2xl font-bold">{users.filter(u => u.role === 'teacher').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> User Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : users.length === 0 ? <p className="text-sm text-muted-foreground">No users found.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Change Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">{u.full_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                        <TableCell><Badge className={`capitalize ${roleColor(u.role)}`}>{u.role === 'sub_admin' ? 'Sub-Admin' : u.role}</Badge></TableCell>
                        <TableCell>
                          <Select value={u.role} onValueChange={v => handleRoleChange(u.user_id, v)}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="sub_admin">Sub-Admin</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Role Permissions Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Sub-Admin</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Parent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { module: 'Dashboard', admin: 'Full', sub: 'School', teacher: 'View', student: 'View', parent: 'View' },
                    { module: 'Students', admin: 'Full', sub: 'View', teacher: 'View', student: '—', parent: '—' },
                    { module: 'Staff', admin: 'Full', sub: 'View', teacher: '—', student: '—', parent: '—' },
                    { module: 'Attendance', admin: 'Full', sub: 'View', teacher: 'Manage', student: 'Own', parent: 'Child' },
                    { module: 'Academics', admin: 'Full', sub: 'View', teacher: 'Manage', student: 'Own', parent: 'Child' },
                    { module: 'Fees', admin: 'Full', sub: 'View', teacher: '—', student: 'Own', parent: 'Child' },
                    { module: 'Finance', admin: 'Full', sub: '—', teacher: '—', student: '—', parent: '—' },
                    { module: 'Settings', admin: 'Full', sub: 'View', teacher: '—', student: '—', parent: '—' },
                    { module: 'Permissions', admin: 'Full', sub: '—', teacher: '—', student: '—', parent: '—' },
                  ].map(r => (
                    <TableRow key={r.module}>
                      <TableCell className="font-medium">{r.module}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{r.admin}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.sub}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.teacher}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.student}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.parent}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default PermissionsPage;
