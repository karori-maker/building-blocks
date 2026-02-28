import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import ExportButton from '@/components/common/ExportButton';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

const FeesPage = () => {
  const [structure, setStructure] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('fee_structure').select('*, classes(name, section)').order('fee_type'),
      supabase.from('fee_payments').select('*, students(full_name, student_id), fee_structure(fee_type)').order('payment_date', { ascending: false }).limit(100),
      supabase.from('classes').select('*').order('name'),
      supabase.from('students').select('id, full_name').order('full_name'),
    ]).then(([s, p, c, st]) => {
      setStructure(s.data || []); setPayments(p.data || []); setClasses(c.data || []); setStudents(st.data || []);
      setLoading(false);
    });
  };
  useEffect(() => { fetchData(); }, []);

  const totalCollected = payments.reduce((s, p) => s + Number(p.amount_paid), 0);

  const AddFeeForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ fee_type: '', amount: '', class_id: '', academic_year: '2025-2026' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('fee_structure').insert({ fee_type: form.fee_type, amount: Number(form.amount), class_id: form.class_id || null, academic_year: form.academic_year });
      if (error) toast.error(error.message); else { toast.success('Fee type added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Fee Type *</Label><Input required value={form.fee_type} onChange={e => setForm(f => ({ ...f, fee_type: e.target.value }))} placeholder="tuition, transport..." /></div>
          <div className="space-y-1"><Label>Amount *</Label><Input type="number" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academic_year} onChange={e => setForm(f => ({ ...f, academic_year: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Fee Type'}</Button>
      </form>
    );
  };

  const AddPaymentForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ student_id: '', fee_structure_id: '', amount_paid: '', payment_method: 'cash', receipt_number: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('fee_payments').insert({ student_id: form.student_id, fee_structure_id: form.fee_structure_id || null, amount_paid: Number(form.amount_paid), payment_method: form.payment_method, receipt_number: form.receipt_number || null });
      if (error) toast.error(error.message); else { toast.success('Payment recorded'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Student *</Label><Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Fee Type</Label><Select value={form.fee_structure_id} onValueChange={v => setForm(f => ({ ...f, fee_structure_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{structure.map(s => <SelectItem key={s.id} value={s.id}>{s.fee_type}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Amount *</Label><Input type="number" required value={form.amount_paid} onChange={e => setForm(f => ({ ...f, amount_paid: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Method</Label><Select value={form.payment_method} onValueChange={v => setForm(f => ({ ...f, payment_method: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="online">Online</SelectItem></SelectContent></Select></div>
          <div className="space-y-1"><Label>Receipt #</Label><Input value={form.receipt_number} onChange={e => setForm(f => ({ ...f, receipt_number: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving || !form.student_id}>{saving ? 'Saving...' : 'Record Payment'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Fees" description="Fee management and payment tracking" icon={CreditCard}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Fee Types</p><p className="text-2xl font-bold">{structure.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Payments</p><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Collected</p><p className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</p></CardContent></Card>
        </div>
        <Tabs defaultValue="structure">
          <TabsList><TabsTrigger value="structure">Fee Structure</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger></TabsList>
          <TabsContent value="structure">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Fee Structure</CardTitle>
              <div className="flex gap-2">
                <ExportButton onClick={() => exportToCSV(structure.map(s => ({ fee_type: s.fee_type, class: s.classes ? `${s.classes.name} ${s.classes.section}` : 'All', amount: s.amount, academic_year: s.academic_year })), 'fee_structure')} />
                <AddDialog title="Add Fee Type" triggerLabel="Add Fee Type">{({ onClose }) => <AddFeeForm onClose={onClose} />}</AddDialog>
              </div>
            </CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : structure.length === 0 ? <p className="text-sm text-muted-foreground">No fee structure found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Fee Type</TableHead><TableHead>Class</TableHead><TableHead>Amount</TableHead><TableHead>Academic Year</TableHead></TableRow></TableHeader>
              <TableBody>{structure.map(s => <TableRow key={s.id}><TableCell className="font-medium capitalize">{s.fee_type}</TableCell><TableCell>{s.classes ? `${s.classes.name} ${s.classes.section}` : 'All'}</TableCell><TableCell className="font-mono">${Number(s.amount).toLocaleString()}</TableCell><TableCell>{s.academic_year}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="payments">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Payment Records</CardTitle>
              <div className="flex gap-2">
                <ExportButton onClick={() => exportToCSV(payments.map(p => ({ receipt: p.receipt_number || '', student: p.students?.full_name || '', fee_type: p.fee_structure?.fee_type || '', amount: p.amount_paid, method: p.payment_method, date: p.payment_date, status: p.status })), 'payments')} />
                <AddDialog title="Record Payment" triggerLabel="Add Payment">{({ onClose }) => <AddPaymentForm onClose={onClose} />}</AddDialog>
              </div>
            </CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Student</TableHead><TableHead>Fee Type</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{payments.map(p => <TableRow key={p.id}><TableCell className="font-mono text-xs">{p.receipt_number || '—'}</TableCell><TableCell className="font-medium">{p.students?.full_name || '—'}</TableCell><TableCell className="capitalize">{p.fee_structure?.fee_type || '—'}</TableCell><TableCell className="font-mono">${Number(p.amount_paid).toLocaleString()}</TableCell><TableCell className="capitalize">{p.payment_method}</TableCell><TableCell className="font-mono text-xs">{p.payment_date}</TableCell><TableCell><Badge variant="outline" className="capitalize">{p.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['student', 'parent']}>
        <Card><CardHeader><CardTitle className="text-base">My Fee Structure</CardTitle></CardHeader><CardContent>{structure.length === 0 ? <p className="text-sm text-muted-foreground">No fee information available.</p> : (<div className="space-y-3">{structure.map(s => (<div key={s.id} className="flex justify-between items-center border-b pb-2 last:border-0"><p className="font-medium capitalize">{s.fee_type}</p><p className="font-mono font-bold">${Number(s.amount).toLocaleString()}</p></div>))}</div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader><CardContent>{payments.length === 0 ? <p className="text-sm text-muted-foreground">No payments recorded.</p> : (<div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Receipt</TableHead><TableHead>Fee Type</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{payments.map(p => <TableRow key={p.id}><TableCell className="font-mono text-xs">{p.receipt_number || '—'}</TableCell><TableCell className="capitalize">{p.fee_structure?.fee_type || '—'}</TableCell><TableCell className="font-mono">${Number(p.amount_paid).toLocaleString()}</TableCell><TableCell className="font-mono text-xs">{p.payment_date}</TableCell><TableCell><Badge variant="outline" className="capitalize">{p.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>)}</CardContent></Card>
      </RoleSection>
    </ModulePage>
  );
};

export default FeesPage;
