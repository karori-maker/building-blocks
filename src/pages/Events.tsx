import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { setLoading(true); supabase.from('events').select('*').order('start_date', { ascending: false }).then(({ data }) => { setEvents(data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const upcoming = events.filter(e => new Date(e.start_date) >= new Date());
  const past = events.filter(e => new Date(e.start_date) < new Date());
  const types = [...new Set(events.map(e => e.event_type).filter(Boolean))];

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ title: '', description: '', event_type: 'academic', start_date: '', end_date: '', location: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('events').insert({ title: form.title, description: form.description || null, event_type: form.event_type, start_date: form.start_date, end_date: form.end_date || null, location: form.location || null, created_by: user?.id });
      if (error) toast.error(error.message); else { toast.success('Event created'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Title *</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
        <div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Type</Label><Select value={form.event_type} onValueChange={v => setForm(f => ({ ...f, event_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="academic">Academic</SelectItem><SelectItem value="sports">Sports</SelectItem><SelectItem value="cultural">Cultural</SelectItem><SelectItem value="holiday">Holiday</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Start Date *</Label><Input type="date" required value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} /></div>
          <div className="space-y-1"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Create Event'}</Button>
      </form>
    );
  };

  const EventCard = ({ e }: { e: any }) => (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between"><h3 className="font-semibold">{e.title}</h3><Badge variant="outline" className="capitalize">{e.event_type}</Badge></div>
      <p className="text-sm text-muted-foreground">{e.description || 'No description'}</p>
      <div className="flex gap-4 text-xs text-muted-foreground"><span>📅 {e.start_date}{e.end_date ? ` — ${e.end_date}` : ''}</span>{e.location && <span>📍 {e.location}</span>}</div>
    </div>
  );

  return (
    <ModulePage title="Events" description="School events and calendar" icon={CalendarDays}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Events</p><p className="text-2xl font-bold">{events.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-2xl font-bold text-green-600">{upcoming.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Event Types</p><div className="flex flex-wrap gap-1 mt-1">{types.map(t => <Badge key={t} variant="secondary" className="capitalize">{t}</Badge>)}</div></CardContent></Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">All Events</CardTitle><AddDialog title="Create Event" triggerLabel="Add Event">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : events.length === 0 ? <p className="text-sm text-muted-foreground">No events found.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{events.map(e => <EventCard key={e.id} e={e} />)}</div>
          )}</CardContent>
        </Card>
      </RoleSection>
      <RoleSection roles={['teacher', 'student', 'parent']}>
        <Card><CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader><CardContent>{upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming events.</p> : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{upcoming.map(e => <EventCard key={e.id} e={e} />)}</div>)}</CardContent></Card>
        {past.length > 0 && (<Card><CardHeader><CardTitle className="text-base">Past Events</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{past.slice(0, 6).map(e => <EventCard key={e.id} e={e} />)}</div></CardContent></Card>)}
      </RoleSection>
    </ModulePage>
  );
};

export default EventsPage;
