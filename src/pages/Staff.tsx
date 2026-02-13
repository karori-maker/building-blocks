import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const StaffPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('staff').select('*').order('full_name').then(({ data }) => {
      setStaff(data || []);
      setLoading(false);
    });
  }, []);

  const totalActive = staff.filter(s => s.status === 'active').length;
  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

  return (
    <ModulePage title="Staff" description="Manage staff records" icon={UserCog}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Staff</p><p className="text-2xl font-bold">{staff.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active Staff</p><p className="text-2xl font-bold text-green-600">{totalActive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Departments</p><div className="flex flex-wrap gap-1 mt-1">{departments.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Staff List</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : staff.length === 0 ? <p className="text-sm text-muted-foreground">No staff found.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.employee_id}</TableCell>
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>{s.designation || '—'}</TableCell>
                        <TableCell>{s.department || '—'}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default StaffPage;
