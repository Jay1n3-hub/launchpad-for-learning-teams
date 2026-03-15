import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DashboardStats {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  totalProjects: number;
  teamMembers: number;
}

export interface ActivityItem {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  metadata: Record<string, any>;
  created_at: string;
  user_name?: string;
}

export interface AttendanceLog {
  id: string;
  clock_in: string;
  clock_out: string | null;
  location: string;
  notes: string;
}

const isAdminOrPmOrMentor = (roles: string[]) =>
  roles.some((r) => ["admin", "pm", "mentor", "scrum_master", "product_owner", "ceo", "solutions_architect"].includes(r));

export function useDashboardData() {
  const { user, roles, orgId } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0, todoTasks: 0, inProgressTasks: 0, doneTasks: 0,
    totalProjects: 0, teamMembers: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceLog | null>(null);
  const [loading, setLoading] = useState(true);
  const elevated = isAdminOrPmOrMentor(roles);

  useEffect(() => {
    if (!user || !orgId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      // Fetch tasks
      let taskQuery = supabase.from("tasks").select("status", { count: "exact" }).eq("org_id", orgId);
      if (!elevated) taskQuery = taskQuery.eq("assigned_to", user.id);
      const { data: taskData } = await taskQuery;

      const tasks = taskData ?? [];
      setStats((prev) => ({
        ...prev,
        totalTasks: tasks.length,
        todoTasks: tasks.filter((t: any) => t.status === "todo").length,
        inProgressTasks: tasks.filter((t: any) => t.status === "in_progress").length,
        doneTasks: tasks.filter((t: any) => t.status === "done").length,
      }));

      // Fetch projects count
      const { count: projectCount } = await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId);
      setStats((prev) => ({ ...prev, totalProjects: projectCount ?? 0 }));

      // Fetch team members count
      const { count: memberCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId);
      setStats((prev) => ({ ...prev, teamMembers: memberCount ?? 0 }));

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from("activity_feed")
        .select("*")
        .eq("org_id", orgId)
        .order("created_at", { ascending: false })
        .limit(10);
      setActivities((activityData as ActivityItem[]) ?? []);

      // Fetch today's attendance for current user
      const today = new Date().toISOString().split("T")[0];
      const { data: attendanceData } = await supabase
        .from("attendance_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("clock_in", `${today}T00:00:00`)
        .order("clock_in", { ascending: false })
        .limit(1);
      setTodayAttendance(attendanceData?.[0] as AttendanceLog | null ?? null);

      setLoading(false);
    };

    fetchData();
  }, [user, orgId, elevated]);

  return { stats, activities, todayAttendance, setTodayAttendance, loading, elevated };
}
