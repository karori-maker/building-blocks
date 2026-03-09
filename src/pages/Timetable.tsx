import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import ExportButton from '@/components/common/ExportButton';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetablePage = () => {
  const { currentSchool } = useSchool();
  const [entries, setEntries] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchEntries = () => {
    setLoading(true);
    let query = supabase.from('timetable').select('*, subjects(name), classes(name, section)').order('period');
    if (selectedClass !== 'all') query = query.eq('class_id', selectedClass);
    query.then(({ data }) => { setEntries(data || []); setLoading(false); });
  };

  useEffect(() => {
    supabase.from('classes').select('id, name, section').order('name').then(({ data }) => setClasses(data || []));
    supabase.from('subjects').select('id, name').order('name').then(({ data }) => setSubjects(data || []));
  }, []);
  useEffect(() => { fetchEntries(); }, [selectedClass]);

  const grouped = DAYS.map(day => ({ day, periods: entries.filter(e => e.day_of_week === day).sort((a, b) => a.period - b.period) }));

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ day_of_week: 'Monday', period: '1', class_id: '', subject_id: '', start_time: '', end_time: '', room: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('timetable').insert({ day_of_week: form.day_of_week, period: Number(form.period), class_id: form.class_id || null, subject_id: form.subject_id || null, start_time: form.start_time || null, end_time: form.end_time || null, room: form.room || null });
      if (error) toast.error(error.message); else { toast.success('Entry added'); onClose(); fetchEntries(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Day *</Label><Select value={form.day_of_week} onValueChange={v => setForm(f => ({ ...f, day_of_week: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Period *</Label><Input type="number" required min={1} value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Subject</Label><Select value={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Start Time</Label><Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} /></div>
          <div className="space-y-1"><Label>End Time</Label><Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Room</Label><Input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Entry'}</Button>
      </form>
    );
  };

  const TimetableGrid = () => (
    <>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : entries.length === 0 ? <p className="text-sm text-muted-foreground">No timetable entries found.</p> : (
      <div className="space-y-4">{grouped.filter(g => g.periods.length > 0).map(g => (
        <div key={g.day}><h3 className="font-semibold text-sm mb-2">{g.day}</h3><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Time</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Room</TableHead></TableRow></TableHeader><TableBody>{g.periods.map(p => (<TableRow key={p.id}><TableCell>{p.period}</TableCell><TableCell className="font-mono text-xs">{p.start_time || '—'} - {p.end_time || '—'}</TableCell><TableCell className="font-medium">{p.subjects?.name || '—'}</TableCell><TableCell>{p.classes ? `${p.classes.name} ${p.classes.section}` : '—'}</TableCell><TableCell>{p.room || '—'}</TableCell></TableRow>))}</TableBody></Table></div></div>
      ))}</div>
    )}</>
  );

  return (
    <ModulePage title="Timetable" description="Class and teacher schedules" icon={Clock}>
      <RoleSection roles={['admin']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Weekly Timetable</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by class" /></SelectTrigger><SelectContent><SelectItem value="all">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select>
              <ExportButton onClick={() => exportToCSV(entries.map(e => ({ day: e.day_of_week, period: e.period, start: e.start_time || '', end: e.end_time || '', subject: e.subjects?.name || '', class: e.classes ? `${e.classes.name} ${e.classes.section}` : '', room: e.room || '' })), 'timetable')} />
              <AddDialog title="Add Timetable Entry" triggerLabel="Add Entry">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog>
            </div>
          </CardHeader>
          <CardContent><TimetableGrid /></CardContent>
        </Card>
      </RoleSection>
      <RoleSection roles={['teacher']}><Card><CardHeader><CardTitle className="text-base">My Teaching Schedule</CardTitle></CardHeader><CardContent><TimetableGrid /></CardContent></Card></RoleSection>
      <RoleSection roles={['student', 'parent']}><Card><CardHeader><CardTitle className="text-base">My Class Timetable</CardTitle></CardHeader><CardContent><TimetableGrid /></CardContent></Card></RoleSection>
    </ModulePage>
  );
};

export default TimetablePage;
