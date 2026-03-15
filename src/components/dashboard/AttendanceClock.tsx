import { useState } from "react";
import { Clock, MapPin, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { AttendanceLog } from "@/hooks/useDashboardData";

interface AttendanceClockProps {
  todayAttendance: AttendanceLog | null;
  setTodayAttendance: (log: AttendanceLog | null) => void;
}

export default function AttendanceClock({ todayAttendance, setTodayAttendance }: AttendanceClockProps) {
  const { user, orgId } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useState("office");
  const [loading, setLoading] = useState(false);
  const isClockedIn = todayAttendance && !todayAttendance.clock_out;

  const handleClockIn = async () => {
    if (!user || !orgId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance_logs")
      .insert({ user_id: user.id, org_id: orgId, location })
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTodayAttendance(data as AttendanceLog);
      toast({ title: "Clocked In", description: `Location: ${location}` });
    }
  };

  const handleClockOut = async () => {
    if (!todayAttendance) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("attendance_logs")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", todayAttendance.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTodayAttendance(data as AttendanceLog);
      toast({ title: "Clocked Out" });
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Attendance</h3>
      </div>

      {todayAttendance?.clock_out ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Today's session complete</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>In: {formatTime(todayAttendance.clock_in)}</span>
            <span>Out: {formatTime(todayAttendance.clock_out)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{todayAttendance.location}</span>
          </div>
        </div>
      ) : isClockedIn ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Clocked in since {formatTime(todayAttendance.clock_in)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{todayAttendance.location}</span>
          </div>
          <Button size="sm" variant="outline" onClick={handleClockOut} disabled={loading} className="w-full">
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Clock Out
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">🏢 Office</SelectItem>
              <SelectItem value="remote">🏠 Remote</SelectItem>
              <SelectItem value="hybrid">🔀 Hybrid</SelectItem>
              <SelectItem value="client_site">📍 Client Site</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleClockIn} disabled={loading} className="w-full">
            <LogIn className="h-3.5 w-3.5 mr-2" />
            Clock In
          </Button>
        </div>
      )}
    </div>
  );
}
