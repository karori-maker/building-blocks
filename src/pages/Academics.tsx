import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AcademicsPage = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('exams').select('*, classes(name, section), subjects(name)').order('date', { ascending: false }),
      supabase.from('grades').select('*, students(full_name), subjects(name), exams(name)').order('created_at', { ascending: false }).limit(100),
      supabase.from('subjects').select('*, classes(name, section)').order('name'),
      supabase.from('classes').select('*').order('name'),
      supabase.from('students').select('id, full_name').order('full_name'),
    ]).then(([e, g, s, c, st]) => {
      setExams(e.data || []); setGrades(g.data || []); setSubjects(s.data || []); setClasses(c.data || []); setStudents(st.data || []);
      setLoading(false);
    });
  };
  useEffect(() => { fetchData(); }, []);

  const AddExamForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ name: '', exam_type: 'midterm', subject_id: '', class_id: '', date: '', max_marks: '100' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('exams').insert({ name: form.name, exam_type: form.exam_type, subject_id: form.subject_id || null, class_id: form.class_id || null, date: form.date || null, max_marks: Number(form.max_marks) });
      if (error) toast.error(error.message); else { toast.success('Exam added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Type</Label><Select value={form.exam_type} onValueChange={v => setForm(f => ({ ...f, exam_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="midterm">Midterm</SelectItem><SelectItem value="final">Final</SelectItem><SelectItem value="quiz">Quiz</SelectItem><SelectItem value="test">Test</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Subject</Label><Select value={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Max Marks</Label><Input type="number" value={form.max_marks} onChange={e => setForm(f => ({ ...f, max_marks: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Exam'}</Button>
      </form>
    );
  };

  const AddGradeForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', subject_id: '', exam_id: '', marks_obtained: '', grade: '', remarks: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('grades').insert({ student_id: form.student_id, subject_id: form.subject_id || null, exam_id: form.exam_id || null, marks_obtained: form.marks_obtained ? Number(form.marks_obtained) : null, grade: form.grade || null, remarks: form.remarks || null });
      if (error) toast.error(error.message); else { toast.success('Grade added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Student *</Label><Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Subject</Label><Select value={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Exam</Label><Select value={form.exam_id} onValueChange={v => setForm(f => ({ ...f, exam_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Marks</Label><Input type="number" value={form.marks_obtained} onChange={e => setForm(f => ({ ...f, marks_obtained: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Grade</Label><Input value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="A, B, C..." /></div>
        </div>
        <div className="space-y-1"><Label>Remarks</Label><Input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving || !form.student_id}>{saving ? 'Saving...' : 'Add Grade'}</Button>
      </form>
    );
  };

  const AddSubjectForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ name: '', code: '', class_id: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('subjects').insert({ name: form.name, code: form.code || null, class_id: form.class_id || null });
      if (error) toast.error(error.message); else { toast.success('Subject added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Code</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Subject'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Academics" description="Grades, exams, and academic records" icon={BookOpen}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Exams</p><p className="text-2xl font-bold">{exams.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Grade Records</p><p className="text-2xl font-bold">{grades.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Subjects</p><p className="text-2xl font-bold">{subjects.length}</p></CardContent></Card>
        </div>
      </RoleSection>
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="exams">
          <TabsList><TabsTrigger value="exams">Exams</TabsTrigger><TabsTrigger value="grades">Grades</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger></TabsList>
          <TabsContent value="exams">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Exam Schedule</CardTitle><RoleSection roles={['admin']}><AddDialog title="Add Exam" triggerLabel="Add Exam">{({ onClose }) => <AddExamForm onClose={onClose} />}</AddDialog></RoleSection></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : exams.length === 0 ? <p className="text-sm text-muted-foreground">No exams found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Date</TableHead><TableHead>Max Marks</TableHead></TableRow></TableHeader>
                <TableBody>{exams.map(e => <TableRow key={e.id}><TableCell className="font-medium">{e.name}</TableCell><TableCell><Badge variant="outline" className="capitalize">{e.exam_type}</Badge></TableCell><TableCell>{e.subjects?.name || '—'}</TableCell><TableCell>{e.classes ? `${e.classes.name} ${e.classes.section}` : '—'}</TableCell><TableCell className="font-mono text-xs">{e.date || '—'}</TableCell><TableCell>{e.max_marks}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grades">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Grade Records</CardTitle><RoleSection roles={['admin', 'teacher']}><AddDialog title="Add Grade" triggerLabel="Add Grade">{({ onClose }) => <AddGradeForm onClose={onClose} />}</AddDialog></RoleSection></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : grades.length === 0 ? <p className="text-sm text-muted-foreground">No grades found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader>
                <TableBody>{grades.map(g => <TableRow key={g.id}><TableCell className="font-medium">{g.students?.full_name || '—'}</TableCell><TableCell>{g.subjects?.name || '—'}</TableCell><TableCell>{g.exams?.name || '—'}</TableCell><TableCell>{g.marks_obtained ?? '—'}</TableCell><TableCell className="font-bold">{g.grade || '—'}</TableCell><TableCell className="text-sm text-muted-foreground">{g.remarks || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Subjects</CardTitle><RoleSection roles={['admin']}><AddDialog title="Add Subject" triggerLabel="Add Subject">{({ onClose }) => <AddSubjectForm onClose={onClose} />}</AddDialog></RoleSection></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead></TableRow></TableHeader>
                <TableBody>{subjects.map(s => <TableRow key={s.id}><TableCell className="font-mono text-xs">{s.code || '—'}</TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : '—'}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['student', 'parent']}>
        <Card><CardHeader><CardTitle className="text-base">My Grades</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : grades.length === 0 ? <p className="text-sm text-muted-foreground">No grades available yet.</p> : (<div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader><TableBody>{grades.map(g => <TableRow key={g.id}><TableCell>{g.subjects?.name || '—'}</TableCell><TableCell>{g.exams?.name || '—'}</TableCell><TableCell>{g.marks_obtained ?? '—'}</TableCell><TableCell className="font-bold">{g.grade || '—'}</TableCell><TableCell className="text-sm text-muted-foreground">{g.remarks || '—'}</TableCell></TableRow>)}</TableBody></Table></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader><CardContent>{exams.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming exams.</p> : (<div className="space-y-3">{exams.slice(0, 5).map(e => (<div key={e.id} className="flex justify-between items-center border-b pb-2 last:border-0"><div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.subjects?.name} — {e.classes ? `${e.classes.name} ${e.classes.section}` : ''}</p></div><div className="text-right"><p className="font-mono text-xs">{e.date || 'TBD'}</p><Badge variant="outline" className="capitalize">{e.exam_type}</Badge></div></div>))}</div>)}</CardContent></Card>
      </RoleSection>
    </ModulePage>
  );
};

export default AcademicsPage;
