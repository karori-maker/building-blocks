import ModulePage from '@/components/common/ModulePage';
import { Settings, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import RoleSection from '@/components/common/RoleSection';

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    supabase.from('school_settings').select('*').limit(1).single()
      .then(({ data }) => { setSettings(data); if (data) setForm(data); setLoading(false); });
  }, []);

  useEffect(() => {
    if (settings?.logo_url) setLogoPreview(settings.logo_url);
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    let logoUrl = form.logo_url;

    if (logoFile) {
      const ext = logoFile.name.split('.').pop();
      const path = `logos/school-logo.${ext}`;
      const { error: uploadError } = await supabase.storage.from('school-assets').upload(path, logoFile, { upsert: true });
      if (uploadError) { toast.error('Logo upload failed: ' + uploadError.message); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from('school-assets').getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    const updateData = {
      school_name: form.school_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      academic_year: form.academic_year,
      grading_system: form.grading_system,
      logo_url: logoUrl,
    };

    if (settings?.id) {
      const { error } = await supabase.from('school_settings').update(updateData).eq('id', settings.id);
      if (error) toast.error(error.message); else { toast.success('Settings saved'); setSettings({ ...settings, ...updateData }); setEditing(false); }
    } else {
      const { error, data } = await supabase.from('school_settings').insert(updateData).select().single();
      if (error) toast.error(error.message); else { toast.success('Settings created'); setSettings(data); setEditing(false); }
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) toast.error(error.message);
    else { toast.success('Password updated successfully'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
    setPwLoading(false);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) toast.error(error.message);
    else { toast.success('Confirmation email sent to your new address'); setNewEmail(''); }
    setEmailLoading(false);
  };

  return (
    <ModulePage title="Settings" description="School settings and configuration" icon={Settings}>
      <Tabs defaultValue="school">
        <TabsList>
          <TabsTrigger value="school">School Info</TabsTrigger>
          <TabsTrigger value="account">My Account</TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <RoleSection roles={['admin', 'sub_admin']}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">School Information</CardTitle>
                {!editing && <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>}
              </CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : editing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {logoPreview && <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-lg object-contain border" />}
                      <div className="space-y-1">
                        <Label>School Logo</Label>
                        <Input type="file" accept="image/*" onChange={handleLogoChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1"><Label>School Name</Label><Input value={form.school_name || ''} onChange={e => setForm((f: any) => ({ ...f, school_name: e.target.value }))} /></div>
                      <div className="space-y-1"><Label>Email</Label><Input value={form.email || ''} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} /></div>
                      <div className="space-y-1"><Label>Phone</Label><Input value={form.phone || ''} onChange={e => setForm((f: any) => ({ ...f, phone: e.target.value }))} /></div>
                      <div className="space-y-1"><Label>Address</Label><Input value={form.address || ''} onChange={e => setForm((f: any) => ({ ...f, address: e.target.value }))} /></div>
                      <div className="space-y-1"><Label>Academic Year</Label><Input value={form.academic_year || ''} onChange={e => setForm((f: any) => ({ ...f, academic_year: e.target.value }))} /></div>
                      <div className="space-y-1"><Label>Grading System</Label><Input value={form.grading_system || ''} onChange={e => setForm((f: any) => ({ ...f, grading_system: e.target.value }))} /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveSettings} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                      <Button variant="outline" onClick={() => { setEditing(false); setForm(settings || {}); }}>Cancel</Button>
                    </div>
                  </div>
                ) : !settings ? <p className="text-sm text-muted-foreground">No settings configured.</p> : (
                  <div className="space-y-4">
                    {settings.logo_url && <img src={settings.logo_url} alt="School Logo" className="w-24 h-24 rounded-lg object-contain border" />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'School Name', value: settings.school_name },
                        { label: 'Email', value: settings.email },
                        { label: 'Phone', value: settings.phone },
                        { label: 'Address', value: settings.address },
                        { label: 'Academic Year', value: settings.academic_year },
                        { label: 'Grading System', value: settings.grading_system },
                      ].map(f => (
                        <div key={f.label} className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">{f.label}</p>
                          <p className="text-sm">{f.value || '—'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </RoleSection>
          <RoleSection roles={['teacher', 'student', 'parent']}>
            <Card>
              <CardHeader><CardTitle className="text-base">School Information</CardTitle></CardHeader>
              <CardContent>
                {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : !settings ? <p className="text-sm text-muted-foreground">No settings configured.</p> : (
                  <div className="space-y-4">
                    {settings.logo_url && <img src={settings.logo_url} alt="School Logo" className="w-24 h-24 rounded-lg object-contain border" />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[{ label: 'School Name', value: settings.school_name }, { label: 'Academic Year', value: settings.academic_year }].map(f => (
                        <div key={f.label} className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{f.label}</p><p className="text-sm">{f.value || '—'}</p></div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </RoleSection>
        </TabsContent>

        <TabsContent value="account">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="space-y-1"><Label>New Password</Label><Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={6} /></div>
                  <div className="space-y-1"><Label>Confirm New Password</Label><Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required /></div>
                  <Button type="submit" disabled={pwLoading}>{pwLoading ? 'Updating...' : 'Update Password'}</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Change Email</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleChangeEmail} className="space-y-3">
                  <p className="text-sm text-muted-foreground">Current: {user?.email}</p>
                  <div className="space-y-1"><Label>New Email</Label><Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required /></div>
                  <Button type="submit" disabled={emailLoading}>{emailLoading ? 'Sending...' : 'Change Email'}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </ModulePage>
  );
};

export default SettingsPage;
