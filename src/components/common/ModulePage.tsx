import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ModulePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}

const ModulePage = ({ title, description, icon: Icon, children }: ModulePageProps) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-xl gradient-primary shadow-sm">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    {children || (
      <Card className="shadow-sm border-border/50">
        <CardHeader><CardTitle className="text-base">Coming Soon</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">This module is under development. Data will appear here once configured.</p></CardContent>
      </Card>
    )}
  </div>
);

export default ModulePage;
