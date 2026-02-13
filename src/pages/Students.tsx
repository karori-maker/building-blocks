import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('students').select('*, classes(name, section)').order('full_name').then(({ data }) => {
      setStudents(data || []);
      setLoading(false);
    });
  }, []);

  const totalActive = students.filter(s => s.status === 'active').length;
  const totalInactive = students.filter(s => s.status !== 'active').length;
  const genderCounts = students.reduce((acc: Record<string, number>, s) => {
    const g = s.gender || 'Unknown';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  return (
    <ModulePage title="Students" description="Manage student records and profiles" icon={Users}>
      {/* Admin: Summary stats */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{totalActive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Inactive</p><p className="text-2xl font-bold text-destructive">{totalInactive}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Gender Breakdown</p><div className="flex gap-2 mt-1">{Object.entries(genderCounts).map(([g, c]) => <Badge key={g} variant="secondary" className="capitalize">{g}: {String(c)}</Badge>)}</div></CardContent></Card>
        </div>
      </RoleSection>

      {/* Admin & Teacher: Full student list */}
      <RoleSection roles={['admin', 'teacher']}>
        <Card>
          <CardHeader><CardTitle className="text-base">Student List</CardTitle></CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : students.length === 0 ? <p className="text-sm text-muted-foreground">No students found.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.student_id}</TableCell>
                        <TableCell className="font-medium">{s.full_name}</TableCell>
                        <TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : '—'}</TableCell>
                        <TableCell className="capitalize">{s.gender || '—'}</TableCell>
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

export default StudentsPage;
