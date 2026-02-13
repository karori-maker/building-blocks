import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const AcademicsPage = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('exams').select('*, classes(name, section), subjects(name)').order('date', { ascending: false }),
      supabase.from('grades').select('*, students(full_name), subjects(name), exams(name)').order('created_at', { ascending: false }).limit(100),
      supabase.from('subjects').select('*, classes(name, section)').order('name'),
    ]).then(([e, g, s]) => {
      setExams(e.data || []);
      setGrades(g.data || []);
      setSubjects(s.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePage title="Academics" description="Grades, exams, and academic records" icon={BookOpen}>
      {/* Admin: Summary stats */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Exams</p><p className="text-2xl font-bold">{exams.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Grade Records</p><p className="text-2xl font-bold">{grades.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Subjects</p><p className="text-2xl font-bold">{subjects.length}</p></CardContent></Card>
        </div>
      </RoleSection>

      {/* Admin & Teacher: Full management tabs */}
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="exams">
          <TabsList><TabsTrigger value="exams">Exams</TabsTrigger><TabsTrigger value="grades">Grades</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger></TabsList>
          <TabsContent value="exams">
            <Card>
              <CardHeader><CardTitle className="text-base">Exam Schedule</CardTitle></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : exams.length === 0 ? <p className="text-sm text-muted-foreground">No exams found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Date</TableHead><TableHead>Max Marks</TableHead></TableRow></TableHeader>
                <TableBody>{exams.map(e => <TableRow key={e.id}><TableCell className="font-medium">{e.name}</TableCell><TableCell><Badge variant="outline" className="capitalize">{e.exam_type}</Badge></TableCell><TableCell>{e.subjects?.name || '—'}</TableCell><TableCell>{e.classes ? `${e.classes.name} ${e.classes.section}` : '—'}</TableCell><TableCell className="font-mono text-xs">{e.date || '—'}</TableCell><TableCell>{e.max_marks}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grades">
            <Card>
              <CardHeader><CardTitle className="text-base">Grade Records</CardTitle></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : grades.length === 0 ? <p className="text-sm text-muted-foreground">No grades found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader>
                <TableBody>{grades.map(g => <TableRow key={g.id}><TableCell className="font-medium">{g.students?.full_name || '—'}</TableCell><TableCell>{g.subjects?.name || '—'}</TableCell><TableCell>{g.exams?.name || '—'}</TableCell><TableCell>{g.marks_obtained ?? '—'}</TableCell><TableCell className="font-bold">{g.grade || '—'}</TableCell><TableCell className="text-sm text-muted-foreground">{g.remarks || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subjects">
            <Card>
              <CardHeader><CardTitle className="text-base">Subjects</CardTitle></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : subjects.length === 0 ? <p className="text-sm text-muted-foreground">No subjects found.</p> : (
                <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead></TableRow></TableHeader>
                <TableBody>{subjects.map(s => <TableRow key={s.id}><TableCell className="font-mono text-xs">{s.code || '—'}</TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : '—'}</TableCell></TableRow>)}</TableBody></Table></div>
              )}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </RoleSection>

      {/* Student & Parent: Read-only grades view */}
      <RoleSection roles={['student', 'parent']}>
        <Card>
          <CardHeader><CardTitle className="text-base">My Grades</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : grades.length === 0 ? <p className="text-sm text-muted-foreground">No grades available yet.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader>
            <TableBody>{grades.map(g => <TableRow key={g.id}><TableCell>{g.subjects?.name || '—'}</TableCell><TableCell>{g.exams?.name || '—'}</TableCell><TableCell>{g.marks_obtained ?? '—'}</TableCell><TableCell className="font-bold">{g.grade || '—'}</TableCell><TableCell className="text-sm text-muted-foreground">{g.remarks || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Upcoming Exams</CardTitle></CardHeader>
          <CardContent>{exams.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming exams.</p> : (
            <div className="space-y-3">{exams.slice(0, 5).map(e => (
              <div key={e.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.subjects?.name} — {e.classes ? `${e.classes.name} ${e.classes.section}` : ''}</p></div>
                <div className="text-right"><p className="font-mono text-xs">{e.date || 'TBD'}</p><Badge variant="outline" className="capitalize">{e.exam_type}</Badge></div>
              </div>
            ))}</div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default AcademicsPage;
