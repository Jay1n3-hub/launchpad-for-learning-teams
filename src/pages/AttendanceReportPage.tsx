import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Timer,
  Users,
} from "lucide-react";

interface AttendanceRow {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  user_name?: string;
}

export default function AttendanceReportPage() {
  const { user, orgId, roles } = useAuth();
  const [logs, setLogs] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"mine" | "team">("mine");
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  // Date range: current week by default
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1); // Monday
    return d.toISOString().split("T")[0];
  });

  const elevated = roles.some((r) =>
    ["admin", "pm", "mentor", "scrum_master", "product_owner", "ceo"].includes(r)
  );

  const weekEnd = (() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  })();

  const fetchLogs = async () => {
    if (!user || !orgId) return;
    setLoading(true);

    let query = supabase
      .from("attendance_logs")
      .select("*")
      .gte("clock_in", `${weekStart}T00:00:00`)
      .lte("clock_in", `${weekEnd}T23:59:59`)
      .order("clock_in", { ascending: false });

    if (viewMode === "mine") {
      query = query.eq("user_id", user.id);
    } else {
      query = query.eq("org_id", orgId);
    }

    const { data } = await query;
    setLogs((data as AttendanceRow[]) ?? []);

    // Fetch profiles for team view
    if (viewMode === "team" && data && data.length > 0) {
      const userIds = [...new Set(data.map((l: any) => l.user_id))];
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const map: Record<string, string> = {};
      profs?.forEach((p: any) => {
        map[p.user_id] = p.name;
      });
      setProfiles(map);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [user, orgId, viewMode, weekStart]);

  const shiftWeek = (dir: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + dir * 7);
    setWeekStart(d.toISOString().split("T")[0]);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  const getDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "In progress";
    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  const locationEmoji: Record<string, string> = {
    office: "🏢",
    remote: "🏠",
    hybrid: "🔀",
    client_site: "📍",
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  // Weekly summary stats
  const totalHours = logs.reduce((acc, log) => {
    if (!log.clock_out) return acc;
    return acc + (new Date(log.clock_out).getTime() - new Date(log.clock_in).getTime());
  }, 0);
  const totalHoursFormatted = `${Math.floor(totalHours / 3600000)}h ${Math.floor((totalHours % 3600000) / 60000)}m`;
  const daysPresent = new Set(logs.map((l) => new Date(l.clock_in).toDateString())).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Attendance Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track attendance history and work hours
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {elevated && (
          <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
            <button
              onClick={() => setViewMode("mine")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === "mine"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="h-3.5 w-3.5" /> My Attendance
            </button>
            <button
              onClick={() => setViewMode("team")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                viewMode === "team"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Team
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => shiftWeek(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => shiftWeek(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Hours</p>
          <p className="text-xl font-semibold text-foreground mt-1">{totalHoursFormatted}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Days Present</p>
          <p className="text-xl font-semibold text-foreground mt-1">{daysPresent}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Sessions</p>
          <p className="text-xl font-semibold text-foreground mt-1">{logs.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Avg / Day</p>
          <p className="text-xl font-semibold text-foreground mt-1">
            {daysPresent > 0
              ? `${Math.floor(totalHours / daysPresent / 3600000)}h ${Math.floor(
                  ((totalHours / daysPresent) % 3600000) / 60000
                )}m`
              : "—"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No attendance records for this week.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {viewMode === "team" && <TableHead>User</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  {viewMode === "team" && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {getInitials(profiles[log.user_id] ?? "")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{profiles[log.user_id] || "Unknown"}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-sm">{formatDate(log.clock_in)}</TableCell>
                  <TableCell className="text-sm font-mono">{formatTime(log.clock_in)}</TableCell>
                  <TableCell className="text-sm font-mono">
                    {log.clock_out ? formatTime(log.clock_out) : (
                      <Badge variant="outline" className="text-emerald-400 border-emerald-600/30 gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Timer className="h-3 w-3 text-muted-foreground" />
                      {getDuration(log.clock_in, log.clock_out)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <span>{locationEmoji[log.location ?? "office"] ?? "📍"}</span>
                      <span className="capitalize">{(log.location ?? "office").replace("_", " ")}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
