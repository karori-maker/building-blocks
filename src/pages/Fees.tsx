import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FeesPage = () => {
  const [structure, setStructure] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('fee_structure').select('*, classes(name, section)').order('fee_type'),
      supabase.from('fee_payments').select('*, students(full_name, student_id), fee_structure(fee_type)').order('payment_date', { ascending: false }).limit(100),
    ]).then(([s, p]) => {
      setStructure(s.data || []);
      setPayments(p.data || []);
      setLoading(false);
    });
  }, []);

  const totalCollected = payments.reduce((s, p) => s + Number(p.amount_paid), 0);

  return (
    <ModulePage title="Fees" description="Fee management and payment tracking" icon={CreditCard}>
      {/* Admin: Summary + full management */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Fee Types</p><p className="text-2xl font-bold">{structure.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Payments</p><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</p></CardContent></Card>
        </div>
        <Tabs defaultValue="structure">
          <TabsList><TabsTrigger value="structure">Fee Structure</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger></TabsList>
          <TabsContent value="structure">
            <Card><CardHeader><CardTitle className="text-base">Fee Structure</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : structure.length === 0 ? <p className="text-sm text-muted-foreground">No fee structure found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Fee Type</TableHead><TableHead>Class</TableHead><TableHead>Amount</TableHead><TableHead>Academic Year</TableHead></TableRow></TableHeader>
              <TableBody>{structure.map(s => <TableRow key={s.id}><TableCell className="font-medium capitalize">{s.fee_type}</TableCell><TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : 'All'}</TableCell><TableCell className="font-mono">${Number(s.amount).toLocaleString()}</TableCell><TableCell>{s.academic_year}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="payments">
            <Card><CardHeader><CardTitle className="text-base">Payment Records</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Student</TableHead><TableHead>Fee Type</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{payments.map(p => <TableRow key={p.id}><TableCell className="font-mono text-xs">{p.receipt_number || '—'}</TableCell><TableCell className="font-medium">{p.students?.full_name || '—'}</TableCell><TableCell className="capitalize">{p.fee_structure?.fee_type || '—'}</TableCell><TableCell className="font-mono">${Number(p.amount_paid).toLocaleString()}</TableCell><TableCell className="capitalize">{p.payment_method}</TableCell><TableCell className="font-mono text-xs">{p.payment_date}</TableCell><TableCell><Badge variant="outline" className="capitalize">{p.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>

      {/* Student & Parent: Fee status view */}
      <RoleSection roles={['student', 'parent']}>
        <Card>
          <CardHeader><CardTitle className="text-base">My Fee Structure</CardTitle></CardHeader>
          <CardContent>{structure.length === 0 ? <p className="text-sm text-muted-foreground">No fee information available.</p> : (
            <div className="space-y-3">{structure.map(s => (
              <div key={s.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <p className="font-medium capitalize">{s.fee_type}</p>
                <p className="font-mono font-bold">${Number(s.amount).toLocaleString()}</p>
              </div>
            ))}</div>
          )}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
          <CardContent>{payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments recorded.</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Fee Type</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{payments.map(p => <TableRow key={p.id}><TableCell className="font-mono text-xs">{p.receipt_number || '—'}</TableCell><TableCell className="capitalize">{p.fee_structure?.fee_type || '—'}</TableCell><TableCell className="font-mono">${Number(p.amount_paid).toLocaleString()}</TableCell><TableCell className="font-mono text-xs">{p.payment_date}</TableCell><TableCell><Badge variant="outline" className="capitalize">{p.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default FeesPage;
