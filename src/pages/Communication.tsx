import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunicationPage = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(50),
    ]).then(([a, m]) => {
      setAnnouncements(a.data || []);
      setMessages(m.data || []);
      setLoading(false);
    });
  }, []);

  const AnnouncementsList = () => (
    <Card>
      <CardHeader><CardTitle className="text-base">Announcements</CardTitle></CardHeader>
      <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements found.</p> : (
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className="border rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{a.title}</h3>
                <Badge variant="outline" className="capitalize">{a.priority}</Badge>
                {a.target_role && <Badge variant="secondary" className="capitalize">{a.target_role}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{a.content || 'No content'}</p>
              <p className="text-xs text-muted-foreground">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}</p>
            </div>
          ))}
        </div>
      )}</CardContent>
    </Card>
  );

  return (
    <ModulePage title="Communication" description="Announcements, messages, and notifications" icon={MessageSquare}>
      {/* Admin & Teacher: Full management with tabs */}
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="announcements">
          <TabsList><TabsTrigger value="announcements">Announcements</TabsTrigger><TabsTrigger value="messages">Messages</TabsTrigger></TabsList>
          <TabsContent value="announcements"><AnnouncementsList /></TabsContent>
          <TabsContent value="messages">
            <Card><CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : messages.length === 0 ? <p className="text-sm text-muted-foreground">No messages found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Content</TableHead><TableHead>Read</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>{messages.map(m => <TableRow key={m.id}><TableCell className="font-medium">{m.subject || '—'}</TableCell><TableCell className="text-sm max-w-[300px] truncate">{m.content}</TableCell><TableCell>{m.is_read ? '✓' : '—'}</TableCell><TableCell className="font-mono text-xs">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>

      {/* Student & Parent: Announcements only */}
      <RoleSection roles={['student', 'parent']}>
        <AnnouncementsList />
      </RoleSection>
    </ModulePage>
  );
};

export default CommunicationPage;
