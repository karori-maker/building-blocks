import ModulePage from '@/components/common/ModulePage';
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

  return (
    <ModulePage title="Library" description="Book catalog and issue/return management" icon={Library}>
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
    </ModulePage>
  );
};

export default LibraryPage;
