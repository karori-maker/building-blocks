import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { useAuth } from '@/contexts/AuthContext';

const CommunicationPage = () => {
  const { user } = useAuth();
  const { currentSchool } = useSchool();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { setLoading(true); Promise.all([supabase.from('announcements').select('*').order('created_at', { ascending: false }), supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(50)]).then(([a, m]) => { setAnnouncements(a.data || []); setMessages(m.data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleDeleteAnnouncement = async (id: string) => { const { error } = await supabase.from('announcements').delete().eq('id', id); if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); } };

  const AddAnnouncementForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ title: '', content: '', priority: 'normal', target_role: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('announcements').insert({ title: form.title, content: form.content || null, priority: form.priority, target_role: (form.target_role as any) || null, created_by: user?.id }); if (error) toast.error(error.message); else { toast.success('Announcement posted'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Title *</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div><div className="space-y-1"><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Priority</Label><Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div><div className="space-y-1"><Label>Target Role</Label><Select value={form.target_role} onValueChange={v => setForm(f => ({ ...f, target_role: v }))}><SelectTrigger><SelectValue placeholder="All roles" /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="teacher">Teacher</SelectItem><SelectItem value="student">Student</SelectItem><SelectItem value="parent">Parent</SelectItem></SelectContent></Select></div></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Post Announcement'}</Button></form>);
  };

  return (
    <ModulePage title="Communication" description="Announcements, messages, and notifications" icon={MessageSquare}>
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="announcements">
          <TabsList><TabsTrigger value="announcements">Announcements</TabsTrigger><TabsTrigger value="messages">Messages</TabsTrigger></TabsList>
          <TabsContent value="announcements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Announcements</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(announcements.map(a => ({ title: a.title, content: a.content || '', priority: a.priority, target_role: a.target_role || 'all', date: a.created_at ? new Date(a.created_at).toLocaleDateString() : '' })), 'announcements')} /><RoleSection roles={['admin']}><AddDialog title="Post Announcement" triggerLabel="New Announcement">{({ onClose }) => <AddAnnouncementForm onClose={onClose} />}</AddDialog></RoleSection></div></CardHeader>
              <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements found.</p> : (
                <div className="space-y-4">{announcements.map(a => (
                  <div key={a.id} className="border rounded-lg p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><h3 className="font-semibold">{a.title}</h3><Badge variant="outline" className="capitalize">{a.priority}</Badge>{a.target_role && <Badge variant="secondary" className="capitalize">{a.target_role}</Badge>}</div>
                      <RoleSection roles={['admin']}><DeleteButton onDelete={() => handleDeleteAnnouncement(a.id)} itemName={a.title} /></RoleSection>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.content || 'No content'}</p>
                    <p className="text-xs text-muted-foreground">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}</p>
                  </div>
                ))}</div>
              )}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages">
            <Card><CardHeader><CardTitle className="text-base">Messages</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : messages.length === 0 ? <p className="text-sm text-muted-foreground">No messages found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Content</TableHead><TableHead>Read</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>{messages.map(m => <TableRow key={m.id}><TableCell className="font-medium">{m.subject || '—'}</TableCell><TableCell className="text-sm max-w-[300px] truncate">{m.content}</TableCell><TableCell>{m.is_read ? '✓' : '—'}</TableCell><TableCell className="font-mono text-xs">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['student', 'parent']}>
        <Card>
          <CardHeader><CardTitle className="text-base">Announcements</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : announcements.length === 0 ? <p className="text-sm text-muted-foreground">No announcements found.</p> : (
            <div className="space-y-4">{announcements.map(a => (
              <div key={a.id} className="border rounded-lg p-4 space-y-1">
                <div className="flex items-center gap-2"><h3 className="font-semibold">{a.title}</h3><Badge variant="outline" className="capitalize">{a.priority}</Badge></div>
                <p className="text-sm text-muted-foreground">{a.content || 'No content'}</p>
                <p className="text-xs text-muted-foreground">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}</p>
              </div>
            ))}</div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default CommunicationPage;
