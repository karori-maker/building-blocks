import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddDialogProps {
  title: string;
  children: (props: { onClose: () => void }) => React.ReactNode;
  triggerLabel?: string;
}

const AddDialog = ({ title, children, triggerLabel = 'Add' }: AddDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" />{triggerLabel}</Button>
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

export default AddDialog;
