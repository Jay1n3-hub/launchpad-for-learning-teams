import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

export default function TopBar() {
  const { profile } = useAuth();

  const initials = profile?.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <LiveClock />
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
        </Link>
        <Link to="/profile" className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-foreground sm:inline">{profile?.name}</span>
        </Link>
      </div>
    </header>
  );
}
