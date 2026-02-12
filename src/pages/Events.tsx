import ModulePage from '@/components/common/ModulePage';
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

  return (
    <ModulePage title="Events" description="School events and calendar" icon={CalendarDays}>
      <Card>
        <CardHeader><CardTitle className="text-base">All Events</CardTitle></CardHeader>
        <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : events.length === 0 ? <p className="text-sm text-muted-foreground">No events found.</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(e => (
              <div key={e.id} className="border rounded-lg p-4 space-y-2">
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
            ))}
          </div>
        )}</CardContent>
      </Card>
    </ModulePage>
  );
};

export default EventsPage;
