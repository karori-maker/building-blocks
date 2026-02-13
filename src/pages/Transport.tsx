import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { Bus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TransportPage = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('transport_vehicles').select('*').order('vehicle_number'),
      supabase.from('transport_routes').select('*, transport_vehicles(vehicle_number)').order('route_name'),
    ]).then(([v, r]) => {
      setVehicles(v.data || []);
      setRoutes(r.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <ModulePage title="Transport" description="Vehicles, routes, and student assignments" icon={Bus}>
      {/* Admin: Full management */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Vehicles</p><p className="text-2xl font-bold">{vehicles.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active Vehicles</p><p className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.status === 'active').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Routes</p><p className="text-2xl font-bold">{routes.length}</p></CardContent></Card>
        </div>
        <Tabs defaultValue="vehicles">
          <TabsList><TabsTrigger value="vehicles">Vehicles</TabsTrigger><TabsTrigger value="routes">Routes</TabsTrigger></TabsList>
          <TabsContent value="vehicles">
            <Card><CardHeader><CardTitle className="text-base">Vehicles</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : vehicles.length === 0 ? <p className="text-sm text-muted-foreground">No vehicles found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Vehicle No</TableHead><TableHead>Driver</TableHead><TableHead>Phone</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{vehicles.map(v => <TableRow key={v.id}><TableCell className="font-mono font-medium">{v.vehicle_number}</TableCell><TableCell>{v.driver_name || '—'}</TableCell><TableCell>{v.driver_phone || '—'}</TableCell><TableCell>{v.capacity}</TableCell><TableCell><Badge variant="outline" className="capitalize">{v.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="routes">
            <Card><CardHeader><CardTitle className="text-base">Routes</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : routes.length === 0 ? <p className="text-sm text-muted-foreground">No routes found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Route Name</TableHead><TableHead>Vehicle</TableHead><TableHead>Stops</TableHead></TableRow></TableHeader>
              <TableBody>{routes.map(r => <TableRow key={r.id}><TableCell className="font-medium">{r.route_name}</TableCell><TableCell className="font-mono">{r.transport_vehicles?.vehicle_number || '—'}</TableCell><TableCell className="text-sm">{Array.isArray(r.stops) ? r.stops.join(', ') : '—'}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>

      {/* Parent: Route info only */}
      <RoleSection roles={['parent']}>
        <Card>
          <CardHeader><CardTitle className="text-base">Transport Routes</CardTitle></CardHeader>
          <CardContent>{routes.length === 0 ? <p className="text-sm text-muted-foreground">No route information available.</p> : (
            <div className="space-y-3">{routes.map(r => (
              <div key={r.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-1"><p className="font-medium">{r.route_name}</p><Badge variant="secondary">{r.transport_vehicles?.vehicle_number || '—'}</Badge></div>
                <p className="text-xs text-muted-foreground">Stops: {Array.isArray(r.stops) ? r.stops.join(' → ') : '—'}</p>
              </div>
            ))}</div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default TransportPage;
