import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('events').select('*').order('start_date', { ascending: false })
      .then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, []);

  const upcoming = events.filter(e => new Date(e.start_date) >= new Date());
  const past = events.filter(e => new Date(e.start_date) < new Date());
  const types = [...new Set(events.map(e => e.event_type).filter(Boolean))];

  const EventCard = ({ e }: { e: any }) => (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{e.title}</h3>
        <Badge variant="outline" className="capitalize">{e.event_type}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{e.description || 'No description'}</p>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>📅 {e.start_date}{e.end_date ? ` — ${e.end_date}` : ''}</span>
        {e.location && <span>📍 {e.location}</span>}
      </div>
    </div>
  );

  return (
    <ModulePage title="Events" description="School events and calendar" icon={CalendarDays}>
      {/* Admin: Stats + all events */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Events</p><p className="text-2xl font-bold">{events.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Upcoming</p><p className="text-2xl font-bold text-green-600">{upcoming.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Event Types</p><div className="flex flex-wrap gap-1 mt-1">{types.map(t => <Badge key={t} variant="secondary" className="capitalize">{t}</Badge>)}</div></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">All Events</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : events.length === 0 ? <p className="text-sm text-muted-foreground">No events found.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{events.map(e => <EventCard key={e.id} e={e} />)}</div>
          )}</CardContent>
        </Card>
      </RoleSection>

      {/* Teacher, Student, Parent: Upcoming events */}
      <RoleSection roles={['teacher', 'student', 'parent']}>
        <Card>
          <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
          <CardContent>{upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming events.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{upcoming.map(e => <EventCard key={e.id} e={e} />)}</div>
          )}</CardContent>
        </Card>
        {past.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Past Events</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{past.slice(0, 6).map(e => <EventCard key={e.id} e={e} />)}</div>
            </CardContent>
          </Card>
        )}
      </RoleSection>
    </ModulePage>
  );
};

export default EventsPage;
