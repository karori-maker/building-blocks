import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface EditDialogProps {
  title: string;
  children: (props: { onClose: () => void }) => React.ReactNode;
  triggerLabel?: string;
}

const EditDialog = ({ title, children, triggerLabel }: EditDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
          <Pencil className="w-3.5 h-3.5" />
          {triggerLabel && <span className="ml-1">{triggerLabel}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children({ onClose: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
