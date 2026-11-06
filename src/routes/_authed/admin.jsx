import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Flag,
  LayoutDashboard,
  Menu,
  ShieldAlert,
  Tags,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin")({
  head: () => ({ meta: [{ title: "Superadmin | Afrik Art" }] }),
  component: AdminLayout,
});

const NAV = [
  { label: "Vue d'ensemble", to: "/admin", icon: LayoutDashboard },
  { label: "Artistes", to: "/admin/artistes", icon: Users },
  { label: "Utilisateurs", to: "/admin/utilisateurs", icon: UserCog },
  { label: "Paiements", to: "/admin/paiements", icon: CreditCard },
  { label: "Monétisation", to: "/admin/monetisation", icon: Wallet },
  { label: "Catégories", to: "/admin/categories", icon: Tags },
  { label: "Signalements", to: "/admin/signalements", icon: Flag },
];

function AdminLayout() {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <ShieldAlert className="h-8 w-8 text-destructive" />
        <h1 className="mt-4 text-xl font-semibold">Accès réservé</h1>
        <p className="mt-2 text-[13px] text-muted-foreground">
          Cet espace est réservé aux administrateurs de la plateforme.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
        >
          Retour à mon espace
        </Link>
      </div>
    );
  }

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
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-[11px] font-semibold text-background">
              AA
            </span>
            <span className="text-[13.5px] font-medium">Superadmin</span>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Espace artiste
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 lg:px-8">
        <aside className={cn("w-full shrink-0 lg:block lg:w-56", open ? "block" : "hidden")}>
          <nav className="space-y-1">
            {NAV.map((item) => {
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