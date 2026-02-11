import ModulePage from '@/components/common/ModulePage';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StudentsPage = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('students').select('*, classes(name, section)').order('full_name').then(({ data }) => {
      setStudents(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePage title="Students" description="Manage student records and profiles" icon={Users}>
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

export default StudentsPage;
