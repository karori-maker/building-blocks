import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
}

const ExportButton = ({ onClick, label = 'Export' }: ExportButtonProps) => (
  <Button variant="outline" size="sm" onClick={onClick} className="gap-1">
    <Download className="w-4 h-4" />
    {label}
  </Button>
);

export default ExportButton;
