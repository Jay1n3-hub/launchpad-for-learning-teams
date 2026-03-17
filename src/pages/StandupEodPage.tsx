import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Sun,
  Moon,
  Send,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

type ReportType = "standup" | "eod";

interface Report {
  id: string;
  user_id: string;
  report_type: string;
  report_date: string;
  yesterday: string;
  today: string;
  blockers: string;
  accomplishments: string;
  notes: string;
  created_at: string;
}

interface ProfileMap {
  [userId: string]: { name: string; email: string };
}

export default function StandupEodPage() {
  const { user, orgId, roles } = useAuth();
  const [tab, setTab] = useState<ReportType>("standup");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [myReport, setMyReport] = useState<Report | null>(null);
  const [teamReports, setTeamReports] = useState<Report[]>([]);
  const [profiles, setProfiles] = useState<ProfileMap>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [blockers, setBlockers] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [notes, setNotes] = useState("");

  const elevated = roles.some((r) =>
    ["admin", "pm", "mentor", "scrum_master", "product_owner", "ceo"].includes(r)
  );

  const fetchReports = async () => {
    if (!user || !orgId) return;
    setLoading(true);

    // Fetch my report for this date and type
    const { data: mine } = await supabase
      .from("standup_reports")
      .select("*")
      .eq("user_id", user.id)
      .eq("org_id", orgId)
      .eq("report_type", tab)
      .eq("report_date", date)
      .maybeSingle();

    const report = mine as Report | null;
    setMyReport(report);
    if (report) {
      setYesterday(report.yesterday);
      setToday(report.today);
      setBlockers(report.blockers);
      setAccomplishments(report.accomplishments);
      setNotes(report.notes);
    } else {
      setYesterday("");
      setToday("");
      setBlockers("");
      setAccomplishments("");
      setNotes("");
    }

    // Fetch team reports if elevated
    if (elevated) {
      const { data: team } = await supabase
        .from("standup_reports")
        .select("*")
        .eq("org_id", orgId)
        .eq("report_type", tab)
        .eq("report_date", date)
        .neq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTeamReports((team as Report[]) ?? []);

      // Fetch profiles for team
      if (team && team.length > 0) {
        const userIds = team.map((r: any) => r.user_id);
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, name, email")
          .in("user_id", userIds);

        const map: ProfileMap = {};
        profs?.forEach((p: any) => {
          map[p.user_id] = { name: p.name, email: p.email };
        });
        setProfiles(map);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [user, orgId, tab, date]);

  const handleSubmit = async () => {
    if (!user || !orgId) return;
    setSubmitting(true);

    const payload = {
      user_id: user.id,
      org_id: orgId,
      report_type: tab,
      report_date: date,
      yesterday,
      today,
      blockers,
      accomplishments,
      notes,
    };

    let error;
    if (myReport) {
      ({ error } = await supabase
        .from("standup_reports")
        .update(payload)
        .eq("id", myReport.id));
    } else {
      ({ error } = await supabase.from("standup_reports").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: myReport ? "Report updated" : "Report submitted" });
      await fetchReports();
    }
    setSubmitting(false);
  };

  const shiftDate = (days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]);
  };

  const isToday = date === new Date().toISOString().split("T")[0];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Standup & EOD Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit your daily standup and end-of-day reports
        </p>
      </div>

      {/* Tab + Date Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
          <button
            onClick={() => setTab("standup")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              tab === "standup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="h-3.5 w-3.5" /> Standup
          </button>
          <button
            onClick={() => setTab("eod")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              tab === "eod"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon className="h-3.5 w-3.5" /> End of Day
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => shiftDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-foreground outline-none text-sm"
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => shiftDate(1)}
            disabled={isToday}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isToday && (
            <Button size="sm" variant="ghost" onClick={() => setDate(new Date().toISOString().split("T")[0])}>
              Today
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* My Report Form */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                {tab === "standup" ? "Morning Standup" : "End of Day Report"}
              </h2>
              {myReport && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Submitted
                </Badge>
              )}
            </div>

            {tab === "standup" ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    What did you do yesterday?
                  </label>
                  <Textarea
                    value={yesterday}
                    onChange={(e) => setYesterday(e.target.value)}
                    placeholder="Completed API integration, fixed auth bug..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    What will you do today?
                  </label>
                  <Textarea
                    value={today}
                    onChange={(e) => setToday(e.target.value)}
                    placeholder="Work on dashboard UI, review PRs..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Any blockers?
                  </label>
                  <Textarea
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Waiting for design specs, need API access..."
                    rows={2}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    What did you accomplish today?
                  </label>
                  <Textarea
                    value={accomplishments}
                    onChange={(e) => setAccomplishments(e.target.value)}
                    placeholder="Finished sprint tasks, deployed feature..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Any blockers or issues?
                  </label>
                  <Textarea
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="Deployment issue, pending review..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Notes for tomorrow
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Follow up on PR, schedule meeting..."
                    rows={2}
                  />
                </div>
              </>
            )}

            <Button onClick={handleSubmit} disabled={submitting} className="w-full gap-2">
              <Send className="h-3.5 w-3.5" />
              {submitting ? "Submitting..." : myReport ? "Update Report" : "Submit Report"}
            </Button>
          </div>

          {/* Team Reports (elevated only) */}
          {elevated && (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Team Reports</h2>
                <Badge variant="outline" className="ml-auto text-xs">
                  {teamReports.length} submitted
                </Badge>
              </div>

              {teamReports.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No team reports for this date yet.
                </p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {teamReports.map((report) => {
                    const profile = profiles[report.user_id];
                    return (
                      <div
                        key={report.id}
                        className="rounded-lg border border-border p-3 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {getInitials(profile?.name ?? "")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-foreground">
                            {profile?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(report.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {tab === "standup" ? (
                          <div className="text-xs space-y-1.5">
                            {report.yesterday && (
                              <div>
                                <span className="text-muted-foreground">Yesterday: </span>
                                <span className="text-foreground">{report.yesterday}</span>
                              </div>
                            )}
                            {report.today && (
                              <div>
                                <span className="text-muted-foreground">Today: </span>
                                <span className="text-foreground">{report.today}</span>
                              </div>
                            )}
                            {report.blockers && (
                              <div>
                                <span className="text-destructive">Blockers: </span>
                                <span className="text-foreground">{report.blockers}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs space-y-1.5">
                            {report.accomplishments && (
                              <div>
                                <span className="text-muted-foreground">Accomplished: </span>
                                <span className="text-foreground">{report.accomplishments}</span>
                              </div>
                            )}
                            {report.blockers && (
                              <div>
                                <span className="text-destructive">Blockers: </span>
                                <span className="text-foreground">{report.blockers}</span>
                              </div>
                            )}
                            {report.notes && (
                              <div>
                                <span className="text-muted-foreground">Notes: </span>
                                <span className="text-foreground">{report.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
