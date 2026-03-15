import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar_url: string | null;
}

export default function TeamOverview() {
  const { orgId } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!orgId) return;
    supabase
      .from("profiles")
      .select("id, name, email, status, avatar_url")
      .eq("org_id", orgId)
      .limit(8)
      .then(({ data }) => setMembers((data as TeamMember[]) ?? []));
  }, [orgId]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Team Overview</h3>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No team members yet.</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase">
                {m.name?.[0] ?? m.email[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{m.name || m.email}</p>
                <p className="text-xs text-muted-foreground truncate">{m.email}</p>
              </div>
              <span className={`text-xs font-medium capitalize ${
                m.status === "active" ? "text-emerald-400" : "text-muted-foreground"
              }`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
