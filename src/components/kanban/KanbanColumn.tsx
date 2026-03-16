import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import type { KanbanTask } from "@/hooks/useKanbanData";
import type { ColumnId } from "@/hooks/useKanbanData";
import { COLUMN_META } from "@/hooks/useKanbanData";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
  columnId: ColumnId;
  tasks: KanbanTask[];
  onAddTask?: () => void;
  onBlockerClick?: (task: KanbanTask) => void;
}

export default function KanbanColumn({ columnId, tasks, onAddTask, onBlockerClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const meta = COLUMN_META[columnId];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border bg-muted/30 p-3 min-h-[300px] transition-colors ${
        isOver ? "border-primary/50 bg-primary/5" : "border-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-widest ${meta.color}`}>
            {meta.label}
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        {columnId === "todo" && onAddTask && (
          <button onClick={onAddTask} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2">
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} onBlockerClick={onBlockerClick} />
          ))}
          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/50 p-4">
              <span className="text-xs text-muted-foreground/60">Drop tasks here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
