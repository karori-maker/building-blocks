import ModulePage from '@/components/common/ModulePage';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const FinancePage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('finance_transactions').select('*').order('date', { ascending: false }).limit(100)
      .then(({ data }) => { setTransactions(data || []); setLoading(false); });
  }, []);

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

  return (
    <ModulePage title="Finance" description="Income, expenses, and financial reports" icon={DollarSign}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Income</p><p className="text-2xl font-bold text-green-600">${income.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold text-destructive">${expense.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Net Balance</p><p className="text-2xl font-bold">${(income - expense).toLocaleString()}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Transaction History</CardTitle></CardHeader>
        <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : transactions.length === 0 ? <p className="text-sm text-muted-foreground">No transactions found.</p> : (
          <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
          <TableBody>{transactions.map(t => <TableRow key={t.id}><TableCell className="font-mono text-xs">{t.date}</TableCell><TableCell><Badge variant="outline" className={t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{t.type}</Badge></TableCell><TableCell className="capitalize">{t.category}</TableCell><TableCell className="text-sm text-muted-foreground">{t.description || '—'}</TableCell><TableCell className="font-mono font-medium">${Number(t.amount).toLocaleString()}</TableCell></TableRow>)}</TableBody></Table></div>
        )}</CardContent>
      </Card>
    </ModulePage>
  );
};

export default FinancePage;
