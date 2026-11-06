import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppShell from "@/components/dashboard/AppShell";
import { DashboardProvider, useDashboard } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/_authed/dashboard")({
  head: () => ({ meta: [{ title: "Mon espace | Afrik Art" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  );
}

function Shell() {
  const { profile, loading } = useDashboard();

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  return (
    <AppShell profile={profile}>
      <Outlet />
    </AppShell>
  );
}