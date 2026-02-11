import ModulePage from '@/components/common/ModulePage';
import { UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StaffPage = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('staff').select('*').order('full_name').then(({ data }) => {
      setStaff(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePage title="Staff" description="Manage staff records" icon={UserCog}>
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
                      <TableCell className="capitalize">{s.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePage>
  );
};

export default StaffPage;
