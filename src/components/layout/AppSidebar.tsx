import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Columns3,
  Users,
  FolderKanban,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/boardly-logo.png";

interface NavItem {
  icon: any;
  label: string;
  path: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FolderKanban, label: "Projects", path: "/dashboard/projects" },
  { icon: Columns3, label: "Board", path: "/dashboard/kanban" },
  { icon: Users, label: "Teams", path: "/team" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  {
    icon: FileText, label: "Reports", path: "/reports",
    children: [
      { icon: FileText, label: "Standup & EOD", path: "/reports/standup-eod" },
      { icon: FileText, label: "Attendance", path: "/reports/attendance" },
    ],
  },
  { icon: Bell, label: "Notifications", path: "/notifications" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Reports: true });
  const location = useLocation();
  const { roles, signOut } = useAuth();

  const isAdmin = roles.includes("admin");

  const allNavItems = [
    ...navItems,
    ...(isAdmin ? [{ icon: ShieldCheck, label: "User Management", path: "/dashboard/admin/users" }] : []),
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups[item.label] ?? false;
    const isChildActive = hasChildren && item.children!.some(c => location.pathname === c.path);
    const active = location.pathname === item.path && !hasChildren;

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => !collapsed && toggleGroup(item.label)}
            className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isChildActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          <AnimatePresence>
            {!collapsed && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pl-7"
              >
                {item.children!.map(child => {
                  const childActive = location.pathname === child.path;
                  return (
                    <Link key={child.path} to={child.path}
                      className={`block rounded-lg px-3 py-2 text-sm transition-all ${
                        childActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                      }`}>
                      {child.label}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link key={item.path} to={item.path}
        className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        }`}>
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
        {active && !collapsed && (
          <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
        )}
      </Link>
    );
  };

  return (
    <aside className={`flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
      collapsed ? "w-16" : "w-60"
    }`}>
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
        <img src={logo} alt="Boardly" className="h-7 w-7 shrink-0" />
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">Boardly</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {allNavItems.map(renderNavItem)}
      </nav>

      {/* Sign Out + Collapse */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
          title={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
