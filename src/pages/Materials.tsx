import ModulePage from '@/components/common/ModulePage';
import RoleSection from '@/components/common/RoleSection';
import AddDialog from '@/components/common/AddDialog';
import { PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const MaterialsPage = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<any[]>([]);
  const [checks, setChecks] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [m, cl, su, st] = await Promise.all([
      supabase.from('required_materials').select('*, classes(name, section), subjects(name)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('name'),
      supabase.from('subjects').select('*').order('name'),
      supabase.from('students').select('id, full_name, user_id').order('full_name'),
    ]);
    setMaterials(m.data || []);
    setClasses(cl.data || []);
    setSubjects(su.data || []);
    setStudents(st.data || []);

    // Find current student record for logged-in user
    const myStudent = (st.data || []).find((s: any) => s.user_id === user?.id);
    setCurrentStudent(myStudent || null);

    // Fetch checks
    const { data: checksData } = await supabase.from('student_material_checks').select('*');
    setChecks(checksData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const toggleCheck = async (materialId: string) => {
    if (!currentStudent) return;
    const existing = checks.find(c => c.student_id === currentStudent.id && c.material_id === materialId);
    if (existing) {
      await supabase.from('student_material_checks').update({ is_obtained: !existing.is_obtained, checked_at: new Date().toISOString() }).eq('id', existing.id);
    } else {
      await supabase.from('student_material_checks').insert({ student_id: currentStudent.id, material_id: materialId, is_obtained: true });
    }
    const { data } = await supabase.from('student_material_checks').select('*');
    setChecks(data || []);
  };

  const isObtained = (materialId: string, studentId?: string) => {
    const sid = studentId || currentStudent?.id;
    return checks.some(c => c.student_id === sid && c.material_id === materialId && c.is_obtained);
  };

  const AddMaterialForm = ({ onClose }: { onClose: () => void }) => {
    const [form, setForm] = useState({ item_name: '', description: '', class_id: '', subject_id: '' });
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault(); setSaving(true);
      const { error } = await supabase.from('required_materials').insert({
        item_name: form.item_name,
        description: form.description || null,
        class_id: form.class_id || null,
        subject_id: form.subject_id || null,
        school_id: currentSchool?.id || null,
      });
      if (error) toast.error(error.message); else { toast.success('Material added'); onClose(); fetchData(); }
      setSaving(false);
    };
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1"><Label>Item Name *</Label><Input required value={form.item_name} onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} placeholder="e.g. Geometry Set" /></div>
        <div className="space-y-1"><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Class</Label><Select value={form.class_id} onValueChange={v => setForm(f => ({ ...f, class_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label>Subject</Label><Select value={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Add Material'}</Button>
      </form>
    );
  };

  const obtainedCount = materials.filter(m => isObtained(m.id)).length;

  return (
    <ModulePage title="Materials" description="Track required materials and supplies" icon={PackageCheck}>
      {/* Admin view: manage required materials */}
      <RoleSection roles={['admin']}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Materials</p><p className="text-2xl font-bold">{materials.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold">{students.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Check Records</p><p className="text-2xl font-bold">{checks.length}</p></CardContent></Card>
        </div>
      </RoleSection>

      <RoleSection roles={['admin', 'teacher']}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Required Materials</CardTitle>
            <RoleSection roles={['admin']}>
              <AddDialog title="Add Required Material" triggerLabel="Add Material">{({ onClose }) => <AddMaterialForm onClose={onClose} />}</AddDialog>
            </RoleSection>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : materials.length === 0 ? <p className="text-sm text-muted-foreground">No materials defined yet.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Description</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead></TableRow></TableHeader>
                  <TableBody>{materials.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.item_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.description || '—'}</TableCell>
                      <TableCell>{m.classes ? `${m.classes.name} ${m.classes.section}` : '—'}</TableCell>
                      <TableCell>{m.subjects?.name || '—'}</TableCell>
                    </TableRow>
                  ))}</TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin/Teacher: view student completion status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Student Completion Status</CardTitle></CardHeader>
          <CardContent>
            {students.length === 0 || materials.length === 0 ? <p className="text-sm text-muted-foreground">No data available.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      {materials.map(m => <TableHead key={m.id} className="text-center text-xs">{m.item_name}</TableHead>)}
                      <TableHead className="text-center">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.slice(0, 50).map(st => {
                      const got = materials.filter(m => isObtained(m.id, st.id)).length;
                      return (
                        <TableRow key={st.id}>
                          <TableCell className="font-medium">{st.full_name}</TableCell>
                          {materials.map(m => (
                            <TableCell key={m.id} className="text-center">
                              {isObtained(m.id, st.id) ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">✓</Badge> : <Badge variant="outline" className="text-muted-foreground">✗</Badge>}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-mono text-xs">{got}/{materials.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>

      {/* Student/Parent view: checklist */}
      <RoleSection roles={['student', 'parent']}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Required Materials</CardTitle>
            <p className="text-sm text-muted-foreground">{obtainedCount} of {materials.length} materials obtained</p>
          </CardHeader>
          <CardContent>
            {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : materials.length === 0 ? <p className="text-sm text-muted-foreground">No materials required yet.</p> : (
              <div className="space-y-3">
                {materials.map(m => {
                  const obtained = isObtained(m.id);
                  return (
                    <div key={m.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${obtained ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-card border-border'}`}>
                      <Checkbox
                        checked={obtained}
                        onCheckedChange={() => toggleCheck(m.id)}
                        disabled={!currentStudent}
                      />
                      <div className="flex-1">
                        <p className={`font-medium ${obtained ? 'line-through text-muted-foreground' : ''}`}>{m.item_name}</p>
                        {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
                        <div className="flex gap-2 mt-1">
                          {m.classes && <Badge variant="outline" className="text-xs">{m.classes.name} {m.classes.section}</Badge>}
                          {m.subjects && <Badge variant="outline" className="text-xs">{m.subjects.name}</Badge>}
                        </div>
                      </div>
                      {obtained ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Obtained</Badge> : <Badge variant="secondary">Pending</Badge>}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </RoleSection>
    </ModulePage>
  );
};

export default MaterialsPage;
