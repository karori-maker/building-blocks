import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const FinancePage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => { setLoading(true); supabase.from('finance_transactions').select('*').order('date', { ascending: false }).limit(100).then(({ data }) => { setTransactions(data || []); setLoading(false); }); };
  useEffect(() => { fetchData(); }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const categories = [...new Set(transactions.map(t => t.category))];

  const AddForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ type: 'income', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('finance_transactions').insert({ type: form.type, category: form.category, amount: Number(form.amount), description: form.description || null, date: form.date });
      if (error) toast.error(error.message); else { toast.success('Transaction added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Type *</Label><Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Category *</Label><Input required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="fees, salary..." /></div>
          <div className="space-y-1"><Label>Amount *</Label><Input type="number" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Date *</Label><Input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
        </div>
        <div className="space-y-1"><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Transaction'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Finance" description="Income, expenses, and financial reports" icon={DollarSign}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Income</p><p className="text-2xl font-bold text-green-600">${income.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold text-destructive">${expense.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Net Balance</p><p className="text-2xl font-bold">${(income - expense).toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Categories</p><div className="flex flex-wrap gap-1 mt-1">{categories.map(c => <Badge key={c} variant="secondary" className="capitalize">{c}</Badge>)}</div></CardContent></Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Transaction History</CardTitle><AddDialog title="Add Transaction" triggerLabel="Add Transaction">{({ onClose }) => <AddForm onClose={onClose} />}</AddDialog></CardHeader>
          <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : transactions.length === 0 ? <p className="text-sm text-muted-foreground">No transactions found.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
            <TableBody>{transactions.map(t => <TableRow key={t.id}><TableCell className="font-mono text-xs">{t.date}</TableCell><TableCell><Badge variant="outline" className={t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{t.type}</Badge></TableCell><TableCell className="capitalize">{t.category}</TableCell><TableCell className="text-sm text-muted-foreground">{t.description || '—'}</TableCell><TableCell className="font-mono font-medium">${Number(t.amount).toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default FinancePage;
