import { CheckCircle2, Circle, Clock, FolderKanban, ListTodo, Users } from "lucide-react";
import type { DashboardStats } from "@/hooks/useDashboardData";

interface StatsCardsProps {
  stats: DashboardStats;
  elevated: boolean;
}

const statConfig = (stats: DashboardStats, elevated: boolean) => {
  const base = [
    { label: "Total Tasks", value: stats.totalTasks, icon: ListTodo, color: "text-primary" },
    { label: "To Do", value: stats.todoTasks, icon: Circle, color: "text-muted-foreground" },
    { label: "In Progress", value: stats.inProgressTasks, icon: Clock, color: "text-yellow-400" },
    { label: "Done", value: stats.doneTasks, icon: CheckCircle2, color: "text-emerald-400" },
  ];
  if (elevated) {
    base.push(
      { label: "Projects", value: stats.totalProjects, icon: FolderKanban, color: "text-primary" },
      { label: "Team Members", value: stats.teamMembers, icon: Users, color: "text-accent" }
    );
  }
  return base;
};

export default function StatsCards({ stats, elevated }: StatsCardsProps) {
  const items = statConfig(stats, elevated);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
