import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ExternalLink, ShieldCheck, UserPlus } from "lucide-react";
import { getSuperadminUsers, inviteAppUser, setUserRole } from "@/lib/admin-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin/utilisateurs")({
  loader: () => getSuperadminUsers(),
  head: () => ({ meta: [{ title: "Superadmin · Utilisateurs | Afrik Art" }] }),
  component: UsersPage,
});

const PLAN_STYLES = {
  starter: "bg-secondary text-foreground/70",
  pro: "bg-primary/10 text-primary",
  premium: "bg-accent/20 text-foreground",
};

function UsersPage() {
  const { items, totals } = Route.useLoaderData();
  const router = useRouter();
  const changeRole = useServerFn(setUserRole);
  const invite = useServerFn(inviteAppUser);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [busy, setBusy] = useState(false);

  async function toggleRole(user) {
    const next = user.role === "admin" ? "user" : "admin";
    try {
      await changeRole({ data: { userId: user.id, role: next } });
      toast.success(next === "admin" ? "Rôle superadmin accordé." : "Rôle repassé en membre.");
      router.invalidate();
    } catch (error) {
      toast.error(error?.message || "Modification impossible.");
    }
  }

  async function submitInvite(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      await invite({ data: { email: email.trim(), role } });
      toast.success(`Invitation envoyée à ${email.trim()}.`);
      setEmail("");
      router.invalidate();
    } catch (error) {
      toast.error(error?.message || "Invitation impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps">Superadmin</p>
        <h1 className="mt-2 text-2xl font-semibold">Utilisateurs</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Gérez les accès à la plateforme : membres inscrits, artistes et superadmins.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Comptes" value={totals.total} />
        <Stat label="Artistes" value={totals.artists} />
        <Stat label="Superadmins" value={totals.admins} />
        <Stat label="Sans profil" value={totals.withoutProfile} />
      </div>

      <form
        onSubmit={submitInvite}
        className="rounded-2xl border border-border bg-background p-5"
      >
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-accent" />
          <p className="text-[13px] font-medium">Inviter un utilisateur</p>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prenom@exemple.com"
            className="h-11 flex-1"
          />
          <div className="flex rounded-full border border-border p-0.5">
            {[
              { key: "user", label: "Membre" },
              { key: "admin", label: "Superadmin" },
            ].map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-[12px] font-medium transition-colors",
                  role === r.key
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-full bg-foreground px-6 text-[12.5px] font-medium text-background disabled:opacity-60"
          >
            {busy ? "Envoi…" : "Inviter"}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        <div className="hidden grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr] gap-4 border-b border-border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground lg:grid">
          <span>Compte</span>
          <span>Profil artiste</span>
          <span>Rôle</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-border">
          {items.map((u) => (
            <div
              key={u.id}
              className="grid gap-3 px-5 py-4 lg:grid-cols-[1.4fr_0.8fr_0.7fr_0.7fr] lg:items-center lg:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium">
                  {u.full_name || u.email}
                </p>
                <p className="truncate text-[12px] text-muted-foreground">{u.email}</p>
              </div>

              <div className="min-w-0">
                {u.profile ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/talents/$slug"
                      params={{ slug: u.profile.slug }}
                      className="inline-flex items-center gap-1 text-[12.5px] font-medium hover:text-primary"
                    >
                      {u.profile.display_name}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
                        PLAN_STYLES[u.profile.plan] || PLAN_STYLES.starter
                      )}
                    >
                      {u.profile.plan}
                    </span>
                    {u.profile.status === "suspended" && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-destructive">
                        Suspendu
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[12px] text-muted-foreground">Aucun profil</span>
                )}
              </div>

              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    u.role === "admin"
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground/70"
                  )}
                >
                  {u.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                  {u.role === "admin" ? "Superadmin" : "Membre"}
                </span>
              </div>

              <div className="lg:text-right">
                <button
                  onClick={() => toggleRole(u)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-[11.5px] font-medium transition-colors hover:border-foreground/30 hover:bg-secondary"
                >
                  {u.role === "admin" ? "Rétrograder" : "Promouvoir"}
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="px-5 py-10 text-center text-[13px] text-muted-foreground">
              Aucun utilisateur pour l'instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-4">
      <p className="text-[22px] font-semibold leading-none">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}