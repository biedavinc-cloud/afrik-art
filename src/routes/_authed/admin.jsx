import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Activity,
  Flag,
  LayoutDashboard,
  Upload,
  Menu,
  Newspaper,
  Plug,
  ShieldAlert,
  Tags,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AssistantWidget from "@/components/ai/AssistantWidget";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin")({
  head: () => ({ meta: [{ title: "Superadmin | Afrik Art" }] }),
  component: AdminLayout,
});

const GROUPS = [
  {
    label: "Pilotage",
    items: [
      { label: "Vue d'ensemble", to: "/admin", icon: LayoutDashboard },
      { label: "Artistes", to: "/admin/artistes", icon: Users },
      { label: "Utilisateurs", to: "/admin/utilisateurs", icon: UserCog },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Paiements", to: "/admin/paiements", icon: CreditCard },
      { label: "Monétisation", to: "/admin/monetisation", icon: Wallet },
      { label: "Connecteurs", to: "/admin/integrations", icon: Plug },
    ],
  },
  {
    label: "Contenu",
    items: [
      { label: "Journal", to: "/admin/blog", icon: Newspaper },
      { label: "Catégories", to: "/admin/categories", icon: Tags },
      { label: "Signalements", to: "/admin/signalements", icon: Flag },
      { label: "Import de données", to: "/admin/import", icon: Upload },
      { label: "Système", to: "/admin/systeme", icon: Activity },
    ],
  },
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

  const current = GROUPS.flatMap((g) => g.items).find(
    (i) => i.to === location.pathname || location.pathname.startsWith(`${i.to}/`)
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Afrik Art" width="32" height="32" className="h-8 w-8 object-contain" />
              <span className="text-[13.5px] font-medium">Afrik Art</span>
            </Link>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="hidden rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 sm:block">
              Superadmin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-[11.5px] text-muted-foreground md:block">
              {user.email}
            </span>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[12px] font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Espace artiste
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-5 py-8 lg:px-8 lg:py-10">
        <aside
          className={cn(
            "w-full shrink-0 lg:block lg:w-56",
            open ? "block" : "hidden"
          )}
        >
          <div className="lg:sticky lg:top-24">
            <p className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Superadmin
            </p>
            <nav className="mt-3 space-y-6">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                    {group.label}
                  </p>
                  <div className="mt-2 space-y-1">
                    {group.items.map((item) => {
                      const active = item.to === location.pathname;
                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                            active
                              ? "bg-foreground text-background shadow-sm"
                              : "text-foreground/65 hover:bg-background hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" strokeWidth={1.7} />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>

      <AssistantWidget page="/admin" />
    </div>
  );
}