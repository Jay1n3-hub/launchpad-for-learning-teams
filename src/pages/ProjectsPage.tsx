import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateProjectDialog from "@/components/kanban/CreateProjectDialog";
import { useToast } from "@/hooks/use-toast";

interface ProjectWithStats {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
  taskCount: number;
  doneCount: number;
  blockedCount: number;
}

export default function ProjectsPage() {
  const { orgId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchProjects = async () => {
    if (!orgId) return;
    const { data: projectData } = await supabase
      .from("projects")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    if (!projectData) { setLoading(false); return; }

    const { data: taskData } = await supabase
      .from("tasks")
      .select("project_id, status")
      .eq("org_id", orgId);

    const tasksByProject: Record<string, { total: number; done: number; blocked: number }> = {};
    (taskData || []).forEach(t => {
      if (!tasksByProject[t.project_id]) tasksByProject[t.project_id] = { total: 0, done: 0, blocked: 0 };
      tasksByProject[t.project_id].total++;
      if (t.status === "done") tasksByProject[t.project_id].done++;
      if (t.status === "blocked") tasksByProject[t.project_id].blocked++;
    });

    setProjects(projectData.map(p => ({
      ...p,
      taskCount: tasksByProject[p.id]?.total || 0,
      doneCount: tasksByProject[p.id]?.done || 0,
      blockedCount: tasksByProject[p.id]?.blocked || 0,
    })));
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [orgId]);

  const handleCreateProject = async (name: string, description?: string) => {
    if (!orgId) return;
    const { error } = await supabase.from("projects").insert({ name, description: description || "", org_id: orgId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Project created" });
      fetchProjects();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <FolderPlus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-12">
          <div className="text-center space-y-3">
            <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No projects yet. Create your first one.</p>
            <Button onClick={() => setShowCreate(true)}>
              <FolderPlus className="h-4 w-4 mr-2" /> Create Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => {
            const progress = p.taskCount > 0 ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
            return (
              <Card
                key={p.id}
                className="cursor-pointer glow-hover"
                onClick={() => navigate(`/dashboard/kanban?project=${p.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  {p.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>{p.taskCount} task{p.taskCount !== 1 ? "s" : ""}</span>
                    {p.blockedCount > 0 && (
                      <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] px-1.5 py-0">
                        {p.blockedCount} blocked
                      </Badge>
                    )}
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{progress}% complete</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateProjectDialog open={showCreate} onOpenChange={setShowCreate} onSubmit={handleCreateProject} />
    </div>
  );
}
