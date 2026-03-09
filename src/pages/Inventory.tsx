import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import EditDialog from '@/components/common/EditDialog';
import DeleteButton from '@/components/common/DeleteButton';
import ExportButton from '@/components/common/ExportButton';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';

const InventoryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchData = () => { setLoading(true); supabase.from('inventory').select('*').order('item_name').then(({ data }) => { setItems(data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);
  const lowStock = items.filter(i => (i.quantity ?? 0) <= (i.min_quantity ?? 5));
  const totalValue = items.reduce((s, i) => s + (i.quantity || 0) * (Number(i.unit_price) || 0), 0);
  const handleDelete = async (id: string) => { const { error } = await supabase.from('inventory').delete().eq('id', id); if (error) toast.error(error.message); else { toast.success('Deleted'); fetchData(); } };

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ item_name: '', category: '', quantity: '0', min_quantity: '5', unit_price: '', location: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('inventory').insert({ item_name: form.item_name, category: form.category || null, quantity: Number(form.quantity), min_quantity: Number(form.min_quantity), unit_price: form.unit_price ? Number(form.unit_price) : null, location: form.location || null }); if (error) toast.error(error.message); else { toast.success('Item added'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Item Name *</Label><Input required value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div><div className="space-y-1"><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div><div className="space-y-1"><Label>Min Qty</Label><Input type="number" value={form.min_quantity} onChange={e => setForm(f => ({ ...f, min_quantity: e.target.value }))} /></div><div className="space-y-1"><Label>Unit Price</Label><Input type="number" step="0.01" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} /></div><div className="space-y-1"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Item'}</Button></form>);
  };

  const EditForm = ({ item, onClose }: { item: any; onClose: () => void }) => {
    const [form, setForm] = useState({ item_name: item.item_name, category: item.category || '', quantity: item.quantity?.toString() || '0', min_quantity: item.min_quantity?.toString() || '5', unit_price: item.unit_price?.toString() || '', location: item.location || '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); const { error } = await supabase.from('inventory').update({ item_name: form.item_name, category: form.category || null, quantity: Number(form.quantity), min_quantity: Number(form.min_quantity), unit_price: form.unit_price ? Number(form.unit_price) : null, location: form.location || null }).eq('id', item.id); if (error) toast.error(error.message); else { toast.success('Updated'); onClose(); fetchData(); } setSaving(false); };
    return (<form onSubmit={handleSubmit} className="space-y-3"><div className="space-y-1"><Label>Item Name *</Label><Input required value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div><div className="space-y-1"><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} /></div><div className="space-y-1"><Label>Min Qty</Label><Input type="number" value={form.min_quantity} onChange={e => setForm(f => ({ ...f, min_quantity: e.target.value }))} /></div><div className="space-y-1"><Label>Unit Price</Label><Input type="number" step="0.01" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} /></div><div className="space-y-1"><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div></div><Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button></form>);
  };

  return (
    <ModulePage title="Inventory" description="Stock management and alerts" icon={Package}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold text-destructive">{lowStock.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold">${totalValue.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Categories</p><p className="text-2xl font-bold">{[...new Set(items.map(i => i.category).filter(Boolean))].length}</p></CardContent></Card>
        </div>
        {lowStock.length > 0 && (<Card className="border-destructive/50 bg-destructive/5"><CardHeader><CardTitle className="text-base text-destructive">⚠ Low Stock Alerts ({lowStock.length})</CardTitle></CardHeader><CardContent className="space-y-1 text-sm">{lowStock.map(i => <div key={i.id} className="flex justify-between"><span>{i.item_name}</span><span className="text-destructive font-medium">{i.quantity} left (min: {i.min_quantity})</span></div>)}</CardContent></Card>)}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">All Items</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(items.map(i => ({ item: i.item_name, category: i.category || '', quantity: i.quantity, min_quantity: i.min_quantity, unit_price: i.unit_price || '', location: i.location || '', status: i.status })), 'inventory')} /><AddDialog title="Add Inventory Item" triggerLabel="Add Item">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog></div></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No inventory items found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Quantity</TableHead><TableHead>Unit Price</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{items.map(i => <TableRow key={i.id}><TableCell className="font-medium">{i.item_name}</TableCell><TableCell>{i.category || '—'}</TableCell><TableCell className={(i.quantity ?? 0) <= (i.min_quantity ?? 5) ? 'text-destructive font-medium' : ''}>{i.quantity}</TableCell><TableCell className="font-mono">{i.unit_price ? `$${Number(i.unit_price).toLocaleString()}` : '—'}</TableCell><TableCell>{i.location || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell>
            <TableCell><div className="flex gap-1"><EditDialog title="Edit Item">{({ onClose }) => <EditForm item={i} onClose={onClose} />}</EditDialog><DeleteButton onDelete={() => handleDelete(i.id)} itemName={i.item_name} /></div></TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default InventoryPage;
