import ModulePage from '@/components/common/ModulePage';
import { ClipboardCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const statusColor: Record<string, string> = {
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  late: 'bg-yellow-100 text-yellow-800',
  'half-day': 'bg-orange-100 text-orange-800',
};

const AttendancePage = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('classes').select('id, name, section').order('name').then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('attendance').select('*, students(full_name, student_id), classes(name, section)').order('date', { ascending: false }).limit(100);
    if (selectedClass !== 'all') query = query.eq('class_id', selectedClass);
    query.then(({ data }) => { setRecords(data || []); setLoading(false); });
  }, [selectedClass]);

  return (
    <ModulePage title="Attendance" description="Mark and manage daily attendance" icon={ClipboardCheck}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Attendance Records</CardTitle>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : records.length === 0 ? <p className="text-sm text-muted-foreground">No attendance records found.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.date}</TableCell>
                      <TableCell className="font-medium">{r.students?.full_name || '—'}</TableCell>
                      <TableCell>{r.classes ? `${r.classes.name} ${r.classes.section}` : '—'}</TableCell>
                      <TableCell><Badge variant="outline" className={statusColor[r.status] || ''}>{r.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.remarks || '—'}</TableCell>
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

export default AttendancePage;
