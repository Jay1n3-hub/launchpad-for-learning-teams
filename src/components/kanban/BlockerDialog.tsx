import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type { KanbanTask } from "@/hooks/useKanbanData";

interface BlockerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: KanbanTask | null;
  onSubmit: (taskId: string, reason: string) => void;
}

export default function BlockerDialog({ open, onOpenChange, task, onSubmit }: BlockerDialogProps) {
  const [reason, setReason] = useState(task?.description || "");

  const handleSubmit = () => {
    if (!task || !reason.trim()) return;
    onSubmit(task.id, reason.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Blocker Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {task && (
            <p className="text-sm text-muted-foreground">
              Task: <span className="font-medium text-foreground">{task.title}</span>
            </p>
          )}
          <div className="space-y-2">
            <Label>Blocker Reason</Label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="What's blocking this task?"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={!reason.trim()}>
            Mark as Blocked
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
