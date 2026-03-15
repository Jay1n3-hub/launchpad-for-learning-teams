import { Activity } from "lucide-react";
import type { ActivityItem } from "@/hooks/useDashboardData";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const actionIcons: Record<string, string> = {
  created: "🆕",
  updated: "✏️",
  completed: "✅",
  commented: "💬",
  clocked_in: "🕐",
  clocked_out: "🕕",
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No recent activity yet. Actions like task updates and clock-ins will appear here.
        </p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {activities.map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 text-base leading-none">
                {actionIcons[item.action] ?? "📌"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-foreground truncate">
                  <span className="font-medium">{(item.metadata as any)?.user_name ?? "Someone"}</span>
                  {" "}{item.action}{" "}
                  <span className="text-muted-foreground">{item.entity_type}</span>
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo(item.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
