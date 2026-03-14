import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingApprovalPage() {
  const { signOut, profile } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Waiting for Administrator Approval</h1>
        <p className="text-sm text-muted-foreground">
          Your account has been created successfully. An administrator needs to assign you a role
          and team before you can access the platform.
        </p>
        {profile?.email && (
          <p className="text-xs text-muted-foreground">
            Signed in as <span className="text-foreground">{profile.email}</span>
          </p>
        )}
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 brand-transition"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
