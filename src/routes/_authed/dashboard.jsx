import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/components/dashboard/DashboardContext";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/dashboard")({
  head: () => ({ meta: [{ title: "Mon espace | Afrik Art" }] }),
  component: DashboardLayout,
});

const NAV = [
  { label: "Aperçu", to: "/dashboard", icon: LayoutDashboard },
  { label: "Mon profil", to: "/dashboard/profil", icon: UserRound },
  { label: "Portfolio", to: "/dashboard/portfolio", icon: Images },
  { label: "Demandes", to: "/dashboard/demandes", icon: Inbox },
  { label: "Abonnement", to: "/dashboard/abonnement", icon: CreditCard },
  { label: "Visibilité", to: "/dashboard/visibilite", icon: Sparkles },
];

function DashboardLayout() {
  return (
    <DashboardProvider>
      <Shell />
    </DashboardProvider>
  );
}

function Shell() {
  const { profile, loading, user } = useDashboard();
  const { logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  const nav = user?.role === "admin"
    ? [...NAV, { label: "Administration", to: "/admin", icon: Shield }]
    : NAV;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
                AG
              </span>
              <span className="text-[13.5px] font-medium">Afrik Art</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/talents/$slug"
              params={{ slug: profile.slug }}
              className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] font-medium transition-colors hover:bg-secondary sm:inline-flex"
            >
              Profil public <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              onClick={() => logout()}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 lg:px-8">
        <aside className={cn("w-full shrink-0 lg:block lg:w-56", open ? "block" : "hidden")}>
          <div className="mb-6 hidden rounded-xl border border-border bg-background p-4 lg:block">
            <p className="truncate text-[13.5px] font-medium">{profile.display_name}</p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              {profile.primary_category}
            </p>
            <span className="mt-2.5 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
              {profile.plan}
            </span>
          </div>
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "text-foreground/70 hover:bg-background hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" strokeWidth={1.7} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}