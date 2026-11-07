import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CreditCard,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PenLine,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  Megaphone,
  UserRound,
  X,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { getUnreadCount } from "@/lib/messaging-fns";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Aperçu", to: "/dashboard", icon: LayoutDashboard },
  { label: "Messages", to: "/messagerie", icon: MessageSquare, badge: true },
  { label: "Demandes", to: "/dashboard/demandes", icon: Inbox },
  { label: "Mon profil", to: "/dashboard/profil", icon: UserRound },
  { label: "Portfolio", to: "/dashboard/portfolio", icon: Images },
  { label: "Blog", to: "/blog", icon: PenLine },
  { label: "Promotion", to: "/centre-promotion", icon: Megaphone },
  { label: "Abonnement", to: "/dashboard/abonnement", icon: CreditCard },
  { label: "Visibilité", to: "/dashboard/visibilite", icon: Sparkles },
  { label: "Factures", to: "/factures", icon: Receipt },
  { label: "Paramètres", to: "/parametres", icon: Settings },
];

export default function AppShell({ children, profile: injected }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(injected ?? null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (injected !== undefined) setProfile(injected);
  }, [injected]);

  useEffect(() => {
    if (injected !== undefined || !user) return;
    base44.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 })
      .then((res) => setProfile((Array.isArray(res) ? res : res?.items || [])[0] || null))
      .catch(() => setProfile(null));
  }, [injected, user]);

  useEffect(() => {
    if (!user) return;
    getUnreadCount()
      .then((res) => setUnread(res?.unread || 0))
      .catch(() => setUnread(0));
  }, [user, location.pathname]);

  const nav =
    user?.role === "admin" ? [...NAV, { label: "Administration", to: "/admin", icon: Shield }] : NAV;

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
                AA
              </span>
              <span className="text-[13.5px] font-medium">Afrik Art</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <Link
                to="/talents/$slug"
                params={{ slug: profile.slug }}
                className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] font-medium transition-colors hover:bg-secondary sm:inline-flex"
              >
                Profil public <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            <Link
              to="/parametres"
              className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] font-medium transition-colors hover:border-accent/60 hover:bg-secondary sm:inline-flex"
            >
              <Settings className="h-3.5 w-3.5" /> Paramètres
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] font-medium text-foreground/70 transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
            </button>
          </div>
        </div>
        <div className="hairline-gold h-px w-full" />
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8 lg:px-8">
        <aside className={cn("w-full shrink-0 lg:block lg:w-56", open ? "block" : "hidden")}>
          <div className="mb-6 hidden rounded-xl border border-border bg-background p-4 lg:block">
            <p className="truncate text-[13.5px] font-medium">
              {profile?.display_name || user?.full_name || "Mon compte"}
            </p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              {profile?.primary_category || user?.email}
            </p>
            {profile && (
              <span className="mt-2.5 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]">
                {profile.plan}
              </span>
            )}
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
                  {item.badge && unread > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                      {unread}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}