import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import { Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LibraryPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('library_books').select('*').order('title'),
      supabase.from('book_issues').select('*, library_books(title), students(full_name)').order('issue_date', { ascending: false }).limit(100),
    ]).then(([b, i]) => {
      setBooks(b.data || []);
      setIssues(i.data || []);
      setLoading(false);
    });
  }, []);

  const totalBooks = books.reduce((s, b) => s + (b.total_copies || 0), 0);
  const available = books.reduce((s, b) => s + (b.available_copies || 0), 0);
  const overdue = issues.filter(i => i.status === 'issued' && i.due_date && new Date(i.due_date) < new Date()).length;

  return (
    <ModulePage title="Library" description="Book catalog and issue/return management" icon={Library}>
      {/* Admin: Stats + full management */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Books</p><p className="text-2xl font-bold">{totalBooks}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Available</p><p className="text-2xl font-bold text-green-600">{available}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Issued</p><p className="text-2xl font-bold text-amber-600">{issues.filter(i => i.status === 'issued').length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-destructive">{overdue}</p></CardContent></Card>
        </div>
      </RoleSection>

      {/* Admin & Teacher: Full tabs */}
      <RoleSection roles={['admin', 'teacher']}>
        <Tabs defaultValue="catalog">
          <TabsList><TabsTrigger value="catalog">Book Catalog</TabsTrigger><TabsTrigger value="issues">Issues/Returns</TabsTrigger></TabsList>
          <TabsContent value="catalog">
            <Card><CardHeader><CardTitle className="text-base">Books</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : books.length === 0 ? <p className="text-sm text-muted-foreground">No books found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>ISBN</TableHead><TableHead>Category</TableHead><TableHead>Available</TableHead><TableHead>Total</TableHead><TableHead>Shelf</TableHead></TableRow></TableHeader>
              <TableBody>{books.map(b => <TableRow key={b.id}><TableCell className="font-medium">{b.title}</TableCell><TableCell>{b.author || '—'}</TableCell><TableCell className="font-mono text-xs">{b.isbn || '—'}</TableCell><TableCell>{b.category || '—'}</TableCell><TableCell className={b.available_copies === 0 ? 'text-destructive font-medium' : ''}>{b.available_copies}</TableCell><TableCell>{b.total_copies}</TableCell><TableCell>{b.shelf_location || '—'}</TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card><CardHeader><CardTitle className="text-base">Book Issues</CardTitle></CardHeader>
            <CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading...</p> : issues.length === 0 ? <p className="text-sm text-muted-foreground">No issues found.</p> : (
              <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Book</TableHead><TableHead>Student</TableHead><TableHead>Issued</TableHead><TableHead>Due</TableHead><TableHead>Returned</TableHead><TableHead>Fine</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{issues.map(i => <TableRow key={i.id}><TableCell className="font-medium">{i.library_books?.title || '—'}</TableCell><TableCell>{i.students?.full_name || '—'}</TableCell><TableCell className="font-mono text-xs">{i.issue_date}</TableCell><TableCell className="font-mono text-xs">{i.due_date || '—'}</TableCell><TableCell className="font-mono text-xs">{i.return_date || '—'}</TableCell><TableCell className="font-mono">{i.fine > 0 ? `$${i.fine}` : '—'}</TableCell><TableCell><Badge variant="outline" className="capitalize">{i.status}</Badge></TableCell></TableRow>)}</TableBody></Table></div>
            )}</CardContent></Card>
          </TabsContent>
        </Tabs>
      </RoleSection>

      {/* Student: Browse catalog */}
      <RoleSection roles={['student']}>
        <Card>
          <CardHeader><CardTitle className="text-base">Browse Books</CardTitle></CardHeader>
          <CardContent>{books.length === 0 ? <p className="text-sm text-muted-foreground">No books available.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{books.map(b => (
              <div key={b.id} className="border rounded-lg p-3 flex justify-between items-start">
                <div><p className="font-medium">{b.title}</p><p className="text-xs text-muted-foreground">{b.author} — {b.category}</p></div>
                <Badge variant={b.available_copies > 0 ? 'secondary' : 'destructive'}>{b.available_copies > 0 ? `${b.available_copies} available` : 'Unavailable'}</Badge>
              </div>
            ))}</div>
          )}</CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default LibraryPage;
