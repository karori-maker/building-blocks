import ModulePage from '@/components/common/ModulePage';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('assignments').select('*, classes(name, section), subjects(name)').order('due_date', { ascending: false }),
      supabase.from('assignment_submissions').select('*, assignments(title), students(full_name)').order('submitted_at', { ascending: false }).limit(100),
    ]).then(([a, s]) => {
      setAssignments(a.data || []);
      setSubmissions(s.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePage title="Assignments" description="Manage assignments and submissions" icon={FileText}>
      <Tabs defaultValue="assignments">
        <TabsList><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="submissions">Submissions</TabsTrigger></TabsList>
        <TabsContent value="assignments">
          <Card><CardHeader><CardTitle className="text-base">All Assignments</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : assignments.length === 0 ? <p className="text-sm text-muted-foreground">No assignments found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Subject</TableHead><TableHead>Class</TableHead><TableHead>Due Date</TableHead><TableHead>Max Marks</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{assignments.map(a => <TableRow key={a.id}><TableCell className="font-medium">{a.title}</TableCell><TableCell>{a.subjects?.name || '—'}</TableCell><TableCell>{a.classes ? `${a.classes.name} ${a.classes.section}` : '—'}</TableCell><TableCell className="font-mono text-xs">{a.due_date || '—'}</TableCell><TableCell>{a.max_marks}</TableCell><TableCell><Badge variant="outline" className="capitalize">{a.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent></Card>
        </TabsContent>
        <TabsContent value="submissions">
          <Card><CardHeader><CardTitle className="text-base">Submissions</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : submissions.length === 0 ? <p className="text-sm text-muted-foreground">No submissions found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Assignment</TableHead><TableHead>Student</TableHead><TableHead>Submitted</TableHead><TableHead>Marks</TableHead><TableHead>Status</TableHead><TableHead>Feedback</TableHead></TableRow></TableHeader>
            <TableBody>{submissions.map(s => <TableRow key={s.id}><TableCell className="font-medium">{s.assignments?.title || '—'}</TableCell><TableCell>{s.students?.full_name || '—'}</TableCell><TableCell className="font-mono text-xs">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</TableCell><TableCell>{s.marks ?? '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{s.status}</Badge></TableCell><TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{s.feedback || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent></Card>
        </TabsContent>
      </Tabs>
    </ModulePage>
  );
};

export default AssignmentsPage;
