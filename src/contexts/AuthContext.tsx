import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  org_id: string | null;
  name: string;
  email: string;
  avatar_url: string | null;
  status: string;
  contract_start_date: string | null;
  contract_end_date: string | null;
  active_days: number;
  prompt_enabled: boolean;
  leave_start: string | null;
  leave_end: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: string[];
  orgId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  roles: [],
  orgId: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single();
            setProfile(profileData as Profile | null);

            const { data: rolesData } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);
            setRoles(rolesData?.map((r: any) => r.role) ?? []);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRoles([]);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const orgId = profile?.org_id ?? null;

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, orgId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
