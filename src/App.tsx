import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import DashboardPage from "./pages/DashboardPage";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Users with no roles are pending admin approval
  if (roles.length === 0) return <PendingApprovalPage />;

  return (
    <AppLayout>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<PlaceholderPage title="Projects" />} />
        <Route path="kanban" element={<PlaceholderPage title="Kanban Board" />} />
        <Route path="team" element={<PlaceholderPage title="Team" />} />
        <Route path="analytics" element={<PlaceholderPage title="Analytics" />} />
        <Route path="reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="reports/standup-eod" element={<PlaceholderPage title="Standup & EOD" />} />
        <Route path="reports/attendance" element={<PlaceholderPage title="Attendance" />} />
        <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="admin/users" element={<PlaceholderPage title="User Management" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          {title} page — coming in later phases.
        </p>
      </div>
    </div>
  );
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <AuthPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard/*" element={<ProtectedRoutes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
