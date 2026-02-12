import ModulePage from '@/components/common/ModulePage';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsPage = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('school_settings').select('*').limit(1).single()
      .then(({ data }) => { setSettings(data); setLoading(false); });
  }, []);

  const fields = settings ? [
    { label: 'School Name', value: settings.school_name },
    { label: 'Email', value: settings.email },
    { label: 'Phone', value: settings.phone },
    { label: 'Address', value: settings.address },
    { label: 'Academic Year', value: settings.academic_year },
    { label: 'Grading System', value: settings.grading_system },
  ] : [];

  return (
    <ModulePage title="Settings" description="School settings and configuration" icon={Settings}>
      <Card>
        <CardHeader><CardTitle className="text-base">School Information</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : !settings ? <p className="text-sm text-muted-foreground">No settings configured.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.label} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{f.label}</p>
                  <p className="text-sm">{f.value || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePage>
  );
};

export default SettingsPage;
