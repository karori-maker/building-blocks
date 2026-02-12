import ModulePage from '@/components/common/ModulePage';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <Tabs defaultValue="exams">
        <TabsList><TabsTrigger value="exams">Exams</TabsTrigger><TabsTrigger value="grades">Grades</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger></TabsList>
        <TabsContent value="exams">
          <Card>
            <CardHeader><CardTitle className="text-base">Exam Schedule</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : exams.length === 0 ? <p className="text-sm text-muted-foreground">No exams found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Date</TableHead><TableHead>Max Marks</TableHead></TableRow></TableHeader>
              <TableBody>{exams.map(e => <TableRow key={e.id}><TableCell className="font-medium">{e.name}</TableCell><TableCell className="capitalize">{e.exam_type}</TableCell><TableCell>{e.subjects?.name || '—'}</TableCell><TableCell>{e.classes ? `${e.classes.name} ${e.classes.section}` : '—'}</TableCell><TableCell className="font-mono text-xs">{e.date || '—'}</TableCell><TableCell>{e.max_marks}</TableCell></TableRow>)}</TableBody></Table></div>
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
    </ModulePage>
  );
};

export default AcademicsPage;
