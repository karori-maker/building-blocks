import ModulePage from '@/components/common/ModulePage';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const severityColor: Record<string, string> = {
  minor: 'bg-yellow-100 text-yellow-800',
  moderate: 'bg-orange-100 text-orange-800',
  major: 'bg-red-100 text-red-800',
};

const DisciplinePage = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('discipline_incidents').select('*, students(full_name)').order('date', { ascending: false }).limit(100)
      .then(({ data }) => { setIncidents(data || []); setLoading(false); });
  }, []);

  return (
    <ModulePage title="Discipline" description="Incident tracking and management" icon={Shield}>
      <Card>
        <CardHeader><CardTitle className="text-base">Discipline Incidents</CardTitle></CardHeader>
        <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : incidents.length === 0 ? <p className="text-sm text-muted-foreground">No incidents found.</p> : (
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Student</TableHead><TableHead>Description</TableHead><TableHead>Severity</TableHead><TableHead>Action Taken</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>{incidents.map(i => <TableRow key={i.id}><TableCell className="font-mono text-xs">{i.date}</TableCell><TableCell className="font-medium">{i.students?.full_name || '—'}</TableCell><TableCell className="text-sm max-w-[250px] truncate">{i.description}</TableCell><TableCell><Badge variant="outline" className={severityColor[i.severity] || ''}>{i.severity}</Badge></TableCell><TableCell className="text-sm">{i.action_taken || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
        )}</CardContent>
      </Card>
    </ModulePage>
  );
};

export default DisciplinePage;
