import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Constants } from "@/integrations/supabase/types";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ALL_ROLES = Constants.public.Enums.app_role;

interface UserRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  status: string;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

export default function UserManagementPage() {
  const { orgId, roles: myRoles } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");

  // Role assignment dialog
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const isAdmin = myRoles.includes("admin");

  const fetchUsers = async () => {
    if (!orgId) return;
    setLoading(true);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    if (!profiles) {
      setLoading(false);
      return;
    }

    // Fetch roles for all users in org
    const userIds = profiles.map((p) => p.user_id);
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("user_id, role")
      .in("user_id", userIds);

    const rolesMap: Record<string, string[]> = {};
    rolesData?.forEach((r) => {
      if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
      rolesMap[r.user_id].push(r.role);
    });

    const mapped: UserRow[] = profiles.map((p) => ({
      id: p.id,
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      status: p.status,
      avatar_url: p.avatar_url,
      created_at: p.created_at,
      roles: rolesMap[p.user_id] ?? [],
    }));

    setUsers(mapped);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [orgId]);

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setAssigning(true);

    const { error } = await supabase.from("user_roles").insert({
      user_id: selectedUser.user_id,
      role: selectedRole as any,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Role already assigned", variant: "destructive" });
      } else {
        toast({ title: "Failed to assign role", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Role assigned", description: `${selectedUser.name} is now ${selectedRole}` });
      await fetchUsers();
    }

    setAssigning(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRemoveRole = async (user: UserRow, role: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.user_id)
      .eq("role", role as any);

    if (error) {
      toast({ title: "Failed to remove role", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role removed", description: `Removed ${role} from ${user.name}` });
      await fetchUsers();
    }
  };

  const handleUpdateStatus = async (user: UserRow, newStatus: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", user.id);

    if (error) {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      await fetchUsers();
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    if (filter === "pending") return matchSearch && u.roles.length === 0;
    if (filter === "active") return matchSearch && u.roles.length > 0;
    return matchSearch;
  });

  const pendingCount = users.filter((u) => u.roles.length === 0).length;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const formatRole = (role: string) =>
    role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage team members, assign roles, and approve new users
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="gap-1.5 px-3 py-1.5 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {pendingCount} pending approval
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
          {(["all", "pending", "active"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "pending" ? "Pending" : "Active"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {search ? "No users match your search." : "No users found."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">{user.name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => {
                              if (confirm(`Remove ${formatRole(role)} role from ${user.name}?`)) {
                                handleRemoveRole(user, role);
                              }
                            }}
                          >
                            {formatRole(role)}
                            <XCircle className="h-3 w-3" />
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(val) => handleUpdateStatus(user, val)}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Active
                          </span>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <span className="flex items-center gap-1.5">
                            <XCircle className="h-3 w-3 text-muted-foreground" /> Inactive
                          </span>
                        </SelectItem>
                        <SelectItem value="on_leave">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-amber-500" /> On Leave
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={user.roles.length === 0 ? "default" : "outline"}
                      className="gap-1.5"
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedRole("");
                      }}
                    >
                      {user.roles.length === 0 ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5" /> Approve
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" /> Add Role
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Assign Role Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(o) => !o && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.roles.length === 0 ? "Approve User" : "Add Role"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.roles.length === 0
                ? `Assign a role to approve ${selectedUser?.name || "this user"} and grant platform access.`
                : `Add an additional role to ${selectedUser?.name || "this user"}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedUser ? getInitials(selectedUser.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{selectedUser?.name || "Unnamed"}</p>
                <p className="text-xs text-muted-foreground">{selectedUser?.email}</p>
              </div>
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.filter(
                  (r) => !selectedUser?.roles.includes(r)
                ).map((role) => (
                  <SelectItem key={role} value={role}>
                    {formatRole(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={!selectedRole || assigning}>
              {assigning ? "Assigning..." : selectedUser?.roles.length === 0 ? "Approve & Assign" : "Add Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
