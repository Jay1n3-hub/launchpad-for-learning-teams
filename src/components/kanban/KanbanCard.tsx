import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Calendar, GripVertical, User } from "lucide-react";
import type { KanbanTask } from "@/hooks/useKanbanData";
import { Badge } from "@/components/ui/badge";

const priorityColors: Record<string, string> = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

interface KanbanCardProps {
  task: KanbanTask;
  onBlockerClick?: (task: KanbanTask) => void;
}

export default function KanbanCard({ task, onBlockerClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-border bg-card p-3 shadow-sm hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-muted-foreground/40 hover:text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
          
          {task.status === "blocked" && task.description && (
            <button
              onClick={() => onBlockerClick?.(task)}
              className="mt-1.5 flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <AlertTriangle className="h-3 w-3" />
              <span className="truncate">{task.description}</span>
            </button>
          )}

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority] || priorityColors.medium}`}>
              {task.priority}
            </Badge>
            {task.due_date && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {task.assigned_name && (
              <span className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
                <User className="h-3 w-3" />
                {task.assigned_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
