import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import ExportButton from '@/components/common/ExportButton';
import { Library } from 'lucide-react';
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

const LibraryPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      supabase.from('library_books').select('*').order('title'),
      supabase.from('book_issues').select('*, library_books(title), students(full_name)').order('issue_date', { ascending: false }).limit(100),
      supabase.from('students').select('id, full_name').order('full_name'),
    ]).then(([b, i, s]) => { setBooks(b.data || []); setIssues(i.data || []); setStudents(s.data || []); setLoading(false); });
  };
  useEffect(() => { fetchData(); }, []);

  const totalBooks = books.reduce((s, b) => s + (b.total_copies || 0), 0);
  const available = books.reduce((s, b) => s + (b.available_copies || 0), 0);
  const overdue = issues.filter(i => i.status === 'issued' && i.due_date && new Date(i.due_date) < new Date()).length;

  const AddBookForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', total_copies: '1', shelf_location: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const copies = Number(form.total_copies);
      const { error } = await supabase.from('library_books').insert({ title: form.title, author: form.author || null, isbn: form.isbn || null, category: form.category || null, total_copies: copies, available_copies: copies, shelf_location: form.shelf_location || null });
      if (error) toast.error(error.message); else { toast.success('Book added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Title *</Label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Author</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
          <div className="space-y-1"><Label>ISBN</Label><Input value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Copies</Label><Input type="number" min={1} value={form.total_copies} onChange={e => setForm(f => ({ ...f, total_copies: e.target.value }))} /></div>
          <div className="space-y-1"><Label>Shelf Location</Label><Input value={form.shelf_location} onChange={e => setForm(f => ({ ...f, shelf_location: e.target.value }))} /></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Book'}</Button>
      </form>
    );
  };

  const AddIssueForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ book_id: '', student_id: '', due_date: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('book_issues').insert({ book_id: form.book_id, student_id: form.student_id, due_date: form.due_date || null });
      if (error) toast.error(error.message); else { toast.success('Book issued'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Book *</Label><Select value={form.book_id} onValueChange={v => setForm(f => ({ ...f, book_id: v }))}><SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger><SelectContent>{books.map(b => <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Student *</Label><Select value={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-1"><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
        <Button type="submit" className="w-full" disabled={saving || !form.book_id || !form.student_id}>{saving ? 'Saving...' : 'Issue Book'}</Button>
      </form>
    );
  };

  return (
    <ModulePage title="Library" description="Book catalog and issue/return management" icon={Library}>
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Books</p><p className="text-2xl font-bold">{totalBooks}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-600">{available}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Issued</p><p className="text-2xl font-bold text-amber-600">{issues.filter(i => i.status === 'issued').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-destructive">{overdue}</p></CardContent></Card>
        </div>
      </RoleSection>
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="catalog">
          <TabsList><TabsTrigger value="catalog">Book Catalog</TabsTrigger><TabsTrigger value="issues">Issues/Returns</TabsTrigger></TabsList>
          <TabsContent value="catalog">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Books</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(books.map(b => ({ title: b.title, author: b.author || '', isbn: b.isbn || '', category: b.category || '', available: b.available_copies, total: b.total_copies, shelf: b.shelf_location || '' })), 'library_books')} /><RoleSection roles={['admin']}><AddDialog title="Add Book" triggerLabel="Add Book">{({ onClose }) => <AddBookForm onClose={onClose} />}</AddDialog></RoleSection></div></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : books.length === 0 ? <p className="text-sm text-muted-foreground">No books found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>ISBN</TableHead><TableHead>Category</TableHead><TableHead>Available</TableHead><TableHead>Total</TableHead><TableHead>Shelf</TableHead></TableRow></TableHeader>
              <TableBody>{books.map(b => <TableRow key={b.id}><TableCell className="font-medium">{b.title}</TableCell><TableCell>{b.author || '—'}</TableCell><TableCell className="font-mono text-xs">{b.isbn || '—'}</TableCell><TableCell>{b.category || '—'}</TableCell><TableCell className={b.available_copies === 0 ? 'text-destructive font-medium' : ''}>{b.available_copies}</TableCell><TableCell>{b.total_copies}</TableCell><TableCell>{b.shelf_location || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Book Issues</CardTitle><div className="flex gap-2"><ExportButton onClick={() => exportToCSV(issues.map(i => ({ book: i.library_books?.title || '', student: i.students?.full_name || '', issued: i.issue_date, due: i.due_date || '', returned: i.return_date || '', fine: i.fine, status: i.status })), 'book_issues')} /><RoleSection roles={['admin']}><AddDialog title="Issue Book" triggerLabel="Issue Book">{({ onClose }) => <AddIssueForm onClose={onClose} />}</AddDialog></RoleSection></div></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : issues.length === 0 ? <p className="text-sm text-muted-foreground">No issues found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Book</TableHead><TableHead>Student</TableHead><TableHead>Issued</TableHead><TableHead>Due</TableHead><TableHead>Returned</TableHead><TableHead>Fine</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{issues.map(i => <TableRow key={i.id}><TableCell className="font-medium">{i.library_books?.title || '—'}</TableCell><TableCell>{i.students?.full_name || '—'}</TableCell><TableCell className="font-mono text-xs">{i.issue_date}</TableCell><TableCell className="font-mono text-xs">{i.due_date || '—'}</TableCell><TableCell className="font-mono text-xs">{i.return_date || '—'}</TableCell><TableCell className="font-mono">{i.fine > 0 ? `$${i.fine}` : '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>
      <RoleSection roles={['student']}>
        <Card><CardHeader><CardTitle className="text-base">Browse Books</CardTitle></CardHeader><CardContent>{books.length === 0 ? <p className="text-sm text-muted-foreground">No books available.</p> : (<div className="grid grid-cols-1 md:grid-cols-2 gap-3">{books.map(b => (<div key={b.id} className="border rounded-lg p-3 flex justify-between items-start"><div><p className="font-medium">{b.title}</p><p className="text-xs text-muted-foreground">{b.author} — {b.category}</p></div><Badge variant={b.available_copies > 0 ? 'secondary' : 'destructive'}>{b.available_copies > 0 ? `${b.available_copies} available` : 'Unavailable'}</Badge></div>))}</div>)}</CardContent></Card>
      </RoleSection>
    </ModulePage>
  );
};

export default LibraryPage;
