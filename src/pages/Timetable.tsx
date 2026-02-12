import ModulePage from '@/components/common/ModulePage';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetablePage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('classes').select('id, name, section').order('name').then(({ data }) => setClasses(data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('timetable').select('*, subjects(name), classes(name, section)').order('period');
    if (selectedClass !== 'all') query = query.eq('class_id', selectedClass);
    query.then(({ data }) => { setEntries(data || []); setLoading(false); });
  }, [selectedClass]);

  const grouped = DAYS.map(day => ({
    day,
    periods: entries.filter(e => e.day_of_week === day).sort((a, b) => a.period - b.period),
  }));

  return (
    <ModulePage title="Timetable" description="Class and teacher schedules" icon={Clock}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Weekly Timetable</CardTitle>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-sm text-muted-foreground">No timetable entries found.</p> : (
            <div className="space-y-4">
              {grouped.filter(g => g.periods.length > 0).map(g => (
                <div key={g.day}>
                  <h3 className="font-semibold text-sm mb-2">{g.day}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Time</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Room</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {g.periods.map(p => (
                          <TableRow key={p.id}>
                            <TableCell>{p.period}</TableCell>
                            <TableCell className="font-mono text-xs">{p.start_time || '—'} - {p.end_time || '—'}</TableCell>
                            <TableCell className="font-medium">{p.subjects?.name || '—'}</TableCell>
                            <TableCell>{p.classes ? `${p.classes.name} ${p.classes.section}` : '—'}</TableCell>
                            <TableCell>{p.room || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePage>
  );
};

export default TimetablePage;
