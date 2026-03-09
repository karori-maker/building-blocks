import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { Bus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const TransportPage = () => {
  const { currentSchool } = useSchool();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = () => { setLoading(true); Promise.all([supabase.from('transport_vehicles').select('*').order('vehicle_number'), supabase.from('transport_routes').select('*, transport_vehicles(vehicle_number)').order('route_name')]).then(([v, r]) => { setVehicles(v.data || []); setRoutes(r.data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const handleDeleteVehicle = async (id: string) => { const { error } = await supabase.from('transport_vehicles').delete().eq('id', id); if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); } };
  const handleDeleteRoute = async (id: string) => { const { error } = await supabase.from('transport_routes').delete().eq('id', id); if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); } };

  const AddVehicleForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ vehicle_number: '', driver_name: '', driver_phone: '', capacity: '40' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('transport_vehicles').insert({ vehicle_number: form.vehicle_number, driver_name: form.driver_name || null, driver_phone: form.driver_phone || null, capacity: Number(form.capacity), school_id: currentSchool?.id || null }); if (error) toast.error(error.message); else { toast.success('Vehicle added'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Vehicle Number *</Label><Input required value={form.vehicle_number} onChange={e => setForm(f => ({ ...f, vehicle_number: e.target.value }))} /></div><div className="space-y-1"><Label>Driver Name</Label><Input value={form.driver_name} onChange={e => setForm(f => ({ ...f, driver_name: e.target.value }))} /></div><div className="space-y-1"><Label>Driver Phone</Label><Input value={form.driver_phone} onChange={e => setForm(f => ({ ...f, driver_phone: e.target.value }))} /></div><div className="space-y-1"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} /></div></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Vehicle'}</Button></form>);
  };

  const EditVehicleForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ vehicle_number: item.vehicle_number, driver_name: item.driver_name || '', driver_phone: item.driver_phone || '', capacity: item.capacity?.toString() || '40', status: item.status || 'active' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('transport_vehicles').update({ vehicle_number: form.vehicle_number, driver_name: form.driver_name || null, driver_phone: form.driver_phone || null, capacity: Number(form.capacity), status: form.status }).eq('id', item.id); if (error) toast.error(error.message); else { toast.success('Updated'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Vehicle Number *</Label><Input required value={form.vehicle_number} onChange={e => setForm(f => ({ ...f, vehicle_number: e.target.value }))} /></div><div className="space-y-1"><Label>Driver</Label><Input value={form.driver_name} onChange={e => setForm(f => ({ ...f, driver_name: e.target.value }))} /></div><div className="space-y-1"><Label>Phone</Label><Input value={form.driver_phone} onChange={e => setForm(f => ({ ...f, driver_phone: e.target.value }))} /></div><div className="space-y-1"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} /></div><div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button></form>);
  };

  const AddRouteForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ route_name: '', vehicle_id: '', stops: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const stopsArr = form.stops ? form.stops.split(',').map(s => s.trim()).filter(Boolean) : null; const { error } = await supabase.from('transport_routes').insert({ route_name: form.route_name, vehicle_id: form.vehicle_id || null, stops: stopsArr }); if (error) toast.error(error.message); else { toast.success('Route added'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Route Name *</Label><Input required value={form.route_name} onChange={e => setForm(f => ({ ...f, route_name: e.target.value }))} /></div><div className="space-y-1"><Label>Vehicle</Label><Select value={form.vehicle_id} onValueChange={v => setForm(f => ({ ...f, vehicle_id: v }))}><SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger><SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.vehicle_number}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1"><Label>Stops (comma-separated)</Label><Input value={form.stops} onChange={e => setForm(f => ({ ...f, stops: e.target.value }))} placeholder="Stop 1, Stop 2" /></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Route'}</Button></form>);
  };

  return (
    <ModulePage title="Transport" description="Vehicles, routes, and student assignments" icon={Bus}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Vehicles</p><p className="text-2xl font-bold">{vehicles.length}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.status === 'active').length}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Routes</p><p className="text-2xl font-bold">{routes.length}</p></CardContent></Card></div>
        <Tabs defaultValue="vehicles">
          <TabsList><TabsTrigger value="vehicles">Vehicles</TabsTrigger><TabsTrigger value="routes">Routes</TabsTrigger></TabsList>
          <TabsContent value="vehicles">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Vehicles</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(vehicles.map(v => ({ vehicle_number: v.vehicle_number, driver: v.driver_name || '', phone: v.driver_phone || '', capacity: v.capacity, status: v.status })), 'vehicles')} /><AddDialog title="Add Vehicle" triggerLabel="Add Vehicle">{({ onClose }) => <AddVehicleForm onClose={onClose} />}</AddDialog></div></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : vehicles.length === 0 ? <p className="text-sm text-muted-foreground">No vehicles found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Vehicle No</TableHead><TableHead>Driver</TableHead><TableHead>Phone</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{vehicles.map(v => <TableRow key={v.id}><TableCell className="font-mono font-medium">{v.vehicle_number}</TableCell><TableCell>{v.driver_name || '—'}</TableCell><TableCell>{v.driver_phone || '—'}</TableCell><TableCell>{v.capacity}</TableCell><TableCell><Badge variant="outline" className="capitalize">{v.status}</Badge></TableCell>
              <TableCell><div className="flex gap-1"><EditDialog title="Edit Vehicle">{({ onClose }) => <EditVehicleForm item={v} onClose={onClose} />}</EditDialog><DeleteButton onDelete={() => handleDeleteVehicle(v.id)} itemName={v.vehicle_number} /></div></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="routes">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Routes</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(routes.map(r => ({ route: r.route_name, vehicle: r.transport_vehicles?.vehicle_number || '', stops: Array.isArray(r.stops) ? r.stops.join(', ') : '' })), 'routes')} /><AddDialog title="Add Route" triggerLabel="Add Route">{({ onClose }) => <AddRouteForm onClose={onClose} />}</AddDialog></div></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : routes.length === 0 ? <p className="text-sm text-muted-foreground">No routes found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Route Name</TableHead><TableHead>Vehicle</TableHead><TableHead>Stops</TableHead><TableHead className="w-[60px]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{routes.map(r => <TableRow key={r.id}><TableCell className="font-medium">{r.route_name}</TableCell><TableCell className="font-mono">{r.transport_vehicles?.vehicle_number || '—'}</TableCell><TableCell className="text-sm">{Array.isArray(r.stops) ? r.stops.join(', ') : '—'}</TableCell>
              <TableCell><DeleteButton onDelete={() => handleDeleteRoute(r.id)} itemName={r.route_name} /></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['parent']}>
        <Card><CardHeader><CardTitle className="text-base">Transport Routes</CardTitle></CardHeader><CardContent>{routes.length === 0 ? <p className="text-sm text-muted-foreground">No route information available.</p> : (<div className="space-y-3">{routes.map(r => (<div key={r.id} className="border rounded-lg p-3"><div className="flex justify-between items-center mb-1"><p className="font-medium">{r.route_name}</p><Badge variant="secondary">{r.transport_vehicles?.vehicle_number || '—'}</Badge></div><p className="text-xs text-muted-foreground">Stops: {Array.isArray(r.stops) ? r.stops.join(' → ') : '—'}</p></div>))}</div>)}</CardContent></Card>
      </RoleSection>
    </ModulePage>
  );
};

export default TransportPage;
