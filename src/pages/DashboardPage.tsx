import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { profile, roles } = useAuth();

  const roleLabel = roles.length > 0
    ? roles.map(r => r.replace(/_/g, " ")).join(", ")
    : "No role assigned";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {profile?.name || "User"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Your Role</p>
              <p className="text-xs capitalize text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          More dashboard features coming in Phase 2 — task stats, activity feed, and attendance tracking.
        </p>
      </div>
    </div>
  );
}
