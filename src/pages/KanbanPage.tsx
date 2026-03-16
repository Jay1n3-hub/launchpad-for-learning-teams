import { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { useKanbanData, type ColumnId, COLUMN_META } from "@/hooks/useKanbanData";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import KanbanCard from "@/components/kanban/KanbanCard";
import CreateTaskDialog from "@/components/kanban/CreateTaskDialog";
import CreateProjectDialog from "@/components/kanban/CreateProjectDialog";
import BlockerDialog from "@/components/kanban/BlockerDialog";
import type { KanbanTask } from "@/hooks/useKanbanData";

const COLUMNS: ColumnId[] = ["todo", "in_progress", "blocked", "done"];

export default function KanbanPage() {
  const {
    projects, selectedProjectId, setSelectedProjectId,
    loading, moveTask, createTask, createProject, updateBlockerReason, getColumnTasks,
  } = useKanbanData();

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [blockerTask, setBlockerTask] = useState<KanbanTask | null>(null);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as KanbanTask | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Determine target column
    let targetColumn: ColumnId | undefined;
    if (COLUMNS.includes(overId as ColumnId)) {
      targetColumn = overId as ColumnId;
    } else {
      // Dropped on another task — find its column
      for (const col of COLUMNS) {
        if (getColumnTasks(col).some(t => t.id === overId)) {
          targetColumn = col;
          break;
        }
      }
    }

    if (!targetColumn) return;

    // If moving to blocked, show blocker dialog
    if (targetColumn === "blocked") {
      const task = getColumnTasks(active.data.current?.task?.status || "todo").find(t => t.id === taskId)
        || { id: taskId, title: "", status: "todo" } as KanbanTask;
      setBlockerTask(task);
      return;
    }

    moveTask(taskId, targetColumn);
  };

  const handleBlockerSubmit = (taskId: string, reason: string) => {
    updateBlockerReason(taskId, reason);
    setBlockerTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Kanban Board</h1>
          <p className="text-sm text-muted-foreground">Drag tasks between columns to update status</p>
        </div>
        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowCreateProject(true)}>
            <FolderPlus className="h-4 w-4 mr-1" /> Project
          </Button>
          <Button size="sm" onClick={() => setShowCreateTask(true)} disabled={!selectedProjectId}>
            <Plus className="h-4 w-4 mr-1" /> Task
          </Button>
        </div>
      </div>

      {/* Board */}
      {!selectedProjectId ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border p-12">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">No projects yet. Create one to get started.</p>
            <Button onClick={() => setShowCreateProject(true)}>
              <FolderPlus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col}
                columnId={col}
                tasks={getColumnTasks(col)}
                onAddTask={col === "todo" ? () => setShowCreateTask(true) : undefined}
                onBlockerClick={task => setBlockerTask(task)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <KanbanCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Dialogs */}
      <CreateTaskDialog open={showCreateTask} onOpenChange={setShowCreateTask} onSubmit={createTask} />
      <CreateProjectDialog open={showCreateProject} onOpenChange={setShowCreateProject} onSubmit={createProject} />
      <BlockerDialog open={!!blockerTask} onOpenChange={open => !open && setBlockerTask(null)} task={blockerTask} onSubmit={handleBlockerSubmit} />
    </div>
  );
}
