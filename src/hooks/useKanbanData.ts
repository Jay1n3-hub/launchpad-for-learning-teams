import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface KanbanTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  assigned_name?: string;
  due_date: string | null;
  project_id: string;
  created_by: string;
  org_id: string;
  blocker_reason?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  org_id: string;
}

const COLUMNS = ["todo", "in_progress", "blocked", "done"] as const;
export type ColumnId = (typeof COLUMNS)[number];

export const COLUMN_META: Record<ColumnId, { label: string; color: string }> = {
  todo: { label: "To Do", color: "text-muted-foreground" },
  in_progress: { label: "In Progress", color: "text-primary" },
  blocked: { label: "Blocked", color: "text-destructive" },
  done: { label: "Done", color: "text-accent" },
};

export function useKanbanData() {
  const { orgId, user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!orgId) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });
    if (data) {
      setProjects(data);
      if (!selectedProjectId && data.length > 0) {
        setSelectedProjectId(data[0].id);
      }
    }
  }, [orgId, selectedProjectId]);

  const fetchTasks = useCallback(async () => {
    if (!orgId || !selectedProjectId) return;
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("org_id", orgId)
      .eq("project_id", selectedProjectId)
      .order("created_at", { ascending: true });

    if (data) {
      // Fetch profile names for assigned users
      const assignedIds = [...new Set(data.filter(t => t.assigned_to).map(t => t.assigned_to!))];
      let nameMap: Record<string, string> = {};
      if (assignedIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", assignedIds);
        if (profiles) {
          nameMap = Object.fromEntries(profiles.map(p => [p.user_id, p.name]));
        }
      }

      setTasks(data.map(t => ({
        ...t,
        assigned_name: t.assigned_to ? nameMap[t.assigned_to] || "Unknown" : undefined,
      })));
    }
  }, [orgId, selectedProjectId]);

  useEffect(() => {
    fetchProjects().then(() => setLoading(false));
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) fetchTasks();
  }, [selectedProjectId, fetchTasks]);

  const moveTask = async (taskId: string, newStatus: ColumnId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);
    if (error) {
      toast({ title: "Error moving task", description: error.message, variant: "destructive" });
      fetchTasks();
    }
  };

  const createTask = async (task: { title: string; description?: string; priority?: string; assigned_to?: string; due_date?: string }) => {
    if (!orgId || !user || !selectedProjectId) return;
    const { error } = await supabase.from("tasks").insert({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      assigned_to: task.assigned_to || null,
      due_date: task.due_date || null,
      org_id: orgId,
      project_id: selectedProjectId,
      created_by: user.id,
      status: "todo",
    });
    if (error) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Task created" });
      fetchTasks();
    }
  };

  const updateBlockerReason = async (taskId: string, reason: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "blocked", blocker_reason: reason } : t));
    const { error } = await supabase
      .from("tasks")
      .update({ status: "blocked", description: reason })
      .eq("id", taskId);
    if (error) {
      toast({ title: "Error updating blocker", description: error.message, variant: "destructive" });
      fetchTasks();
    }
  };

  const createProject = async (name: string, description?: string) => {
    if (!orgId) return;
    const { error } = await supabase.from("projects").insert({
      name,
      description: description || "",
      org_id: orgId,
    });
    if (error) {
      toast({ title: "Error creating project", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project created" });
      fetchProjects();
    }
  };

  const getColumnTasks = (columnId: ColumnId) => tasks.filter(t => t.status === columnId);

  return {
    tasks,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    moveTask,
    createTask,
    createProject,
    updateBlockerReason,
    getColumnTasks,
    fetchTasks,
    fetchProjects,
  };
}
