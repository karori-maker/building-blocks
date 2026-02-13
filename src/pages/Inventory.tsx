import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const InventoryPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('inventory').select('*').order('item_name')
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  const lowStock = items.filter(i => (i.quantity ?? 0) <= (i.min_quantity ?? 5));
  const totalValue = items.reduce((s, i) => s + (i.quantity || 0) * (Number(i.unit_price) || 0), 0);

  return (
    <ModulePage title="Inventory" description="Stock management and alerts" icon={Package}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Items</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-2xl font-bold text-destructive">{lowStock.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold">${totalValue.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Categories</p><p className="text-2xl font-bold">{[...new Set(items.map(i => i.category).filter(Boolean))].length}</p></CardContent></Card>
        </div>

        {lowStock.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader><CardTitle className="text-base text-destructive">⚠ Low Stock Alerts ({lowStock.length})</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              {lowStock.map(i => <div key={i.id} className="flex justify-between"><span>{i.item_name}</span><span className="text-destructive font-medium">{i.quantity} left (min: {i.min_quantity})</span></div>)}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">All Items</CardTitle></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : items.length === 0 ? <p className="text-sm text-muted-foreground">No inventory items found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Quantity</TableHead><TableHead>Unit Price</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{items.map(i => <TableRow key={i.id}><TableCell className="font-medium">{i.item_name}</TableCell><TableCell>{i.category || '—'}</TableCell><TableCell className={(i.quantity ?? 0) <= (i.min_quantity ?? 5) ? 'text-destructive font-medium' : ''}>{i.quantity}</TableCell><TableCell className="font-mono">{i.unit_price ? `$${Number(i.unit_price).toLocaleString()}` : '—'}</TableCell><TableCell>{i.location || '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default InventoryPage;
