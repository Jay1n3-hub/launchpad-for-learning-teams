import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, Building2, UserPlus, KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/boardly-logo.png";

type AuthMode = "login" | "create_org" | "join_org";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [resolvedOrg, setResolvedOrg] = useState<{ id: string; name: string } | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const handleVerifyCode = async () => {
    if (!orgCode.trim()) return;
    setVerifyingCode(true);
    try {
      const { data, error } = await supabase.rpc("get_org_by_code", { _code: orgCode.trim().toUpperCase() });
      if (error) throw error;
      if (data && data.length > 0) {
        setResolvedOrg({ id: data[0].id, name: data[0].name });
      } else {
        setResolvedOrg(null);
        toast.error("Invalid organization code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify code");
      setResolvedOrg(null);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else if (mode === "create_org") {
        if (!orgName.trim()) { toast.error("Organization name is required"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, org_name: orgName } },
        });
        if (error) throw error;
        toast.success("Organization created! You're now signed in.");
      } else {
        if (!resolvedOrg) { toast.error("Please verify your organization code first"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, join_org_id: resolvedOrg.id } },
        });
        if (error) throw error;
        toast.success("Account created! You're now signed in.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <img src={logo} alt="Boardly" className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Boardly</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" && "Sign in to your account"}
            {mode === "create_org" && "Create your organization"}
            {mode === "join_org" && "Join an existing organization"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          {mode === "join_org" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Organization Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => { setOrgCode(e.target.value.toUpperCase()); setResolvedOrg(null); }}
                  required
                  className={`${inputClass} font-mono tracking-widest`}
                  placeholder="ABCD1234"
                  maxLength={8}
                />
                <button type="button" onClick={handleVerifyCode} disabled={verifyingCode || !orgCode.trim()}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/80 disabled:opacity-50">
                  {verifyingCode ? "..." : "Verify"}
                </button>
              </div>
              {resolvedOrg && (
                <p className="flex items-center gap-1 text-xs text-primary">
                  <Shield className="h-3 w-3" />
                  Joining: {resolvedOrg.name}
                </p>
              )}
            </div>
          )}

          {mode !== "login" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className={inputClass} placeholder="Sarah Chen" />
            </div>
          )}

          {mode === "create_org" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Organization Name</label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required
                className={inputClass} placeholder="TechBridge Academy" />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className={inputClass} placeholder="you@example.com" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className={inputClass} placeholder="••••••••" />
          </div>

          {mode === "login" && (
            <div className="text-right">
              <button type="button" onClick={async () => {
                if (!email.trim()) {
                  toast.error("Enter your email first, then click Forgot password");
                  return;
                }
                setLoading(true);
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) throw error;
                  toast.success("Password reset email sent! Check your inbox.");
                } catch (err: any) {
                  toast.error(err.message || "Failed to send reset email");
                } finally {
                  setLoading(false);
                }
              }} className="text-xs text-primary hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign In" : mode === "create_org" ? "Create Organization" : "Sign Up & Join"}
          </button>

          {mode === "login" ? (
            <div className="space-y-2 pt-2 text-center text-sm text-muted-foreground">
              <button type="button" onClick={() => setMode("create_org")}
                className="flex w-full items-center justify-center gap-1 text-primary hover:underline">
                <Building2 className="h-3.5 w-3.5" /> Create a new organization
              </button>
              <button type="button" onClick={() => setMode("join_org")}
                className="flex w-full items-center justify-center gap-1 text-primary hover:underline">
                <KeyRound className="h-3.5 w-3.5" /> Join with organization code
              </button>
            </div>
          ) : (
            <p className="pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setResolvedOrg(null); }}
                className="text-primary hover:underline">Sign in</button>
            </p>
          )}
        </form>

        {mode === "join_org" && (
          <p className="text-center text-xs text-muted-foreground">
            Ask your organization admin for the invite code. After signing up, an admin will assign your role and team.
          </p>
        )}
      </div>
    </div>
  );
}
