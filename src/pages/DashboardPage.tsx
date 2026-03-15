import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import StatsCards from "@/components/dashboard/StatsCards";
import AttendanceClock from "@/components/dashboard/AttendanceClock";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import TeamOverview from "@/components/dashboard/TeamOverview";

export default function DashboardPage() {
  const { profile, roles } = useAuth();
  const { stats, activities, todayAttendance, setTodayAttendance, loading, elevated } = useDashboardData();

  const roleLabel = roles.length > 0
    ? roles.map(r => r.replace(/_/g, " ")).join(", ")
    : "No role assigned";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {profile?.name || "User"}{" "}
          <span className="capitalize text-primary/80">({roleLabel})</span>
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} elevated={elevated} />

      {/* Main Content Grid */}
      <div className={`grid gap-6 ${elevated ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {/* Attendance Clock */}
        <AttendanceClock todayAttendance={todayAttendance} setTodayAttendance={setTodayAttendance} />

        {/* Activity Feed */}
        <ActivityFeed activities={activities} />

        {/* Team Overview - elevated roles only */}
        {elevated && <TeamOverview />}
      </div>
    </div>
  );
}
