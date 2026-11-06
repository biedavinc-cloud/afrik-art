import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Flag, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { getAdminOverview } from "@/lib/server-fns";

export const Route = createFileRoute("/_authed/admin/")({
  loader: () => getAdminOverview(),
  component: AdminOverview,
});

function AdminOverview() {
  const s = Route.useLoaderData();

  const cards = [
    { label: "Artistes inscrits", value: s.artists, hint: `${s.activeArtists} actifs`, icon: Users },
    { label: "Comptes utilisateurs", value: s.users, hint: `${s.suspended} suspendus`, icon: TrendingUp },
    { label: "Œuvres publiées", value: s.artworks, hint: `${s.verified} profils vérifiés`, icon: Sparkles },
    { label: "Revenus confirmés", value: `${s.revenue} $`, hint: `${s.pendingPayments} en attente`, icon: Wallet },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps">Pilotage</p>
          <h1 className="mt-2 font-heading text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-tight">
            Vue d'ensemble
          </h1>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Activité de la plateforme, revenus et files d'attente à traiter.
          </p>
        </div>
        <Link
          to="/admin/integrations"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-[12px] font-medium transition-colors hover:border-foreground/30"
        >
          Connecteurs & IA <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                {c.label}
              </p>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
                <c.icon className="h-3.5 w-3.5 text-foreground/60" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-4 font-heading text-[26px] font-semibold leading-none tracking-tight">
              {c.value}
            </p>
            <p className="mt-2 text-[11.5px] text-muted-foreground">{c.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">Répartition des formules</p>
          <div className="mt-6 space-y-4">
            {[
              { key: "starter", label: "Starter", color: "bg-muted-foreground/40" },
              { key: "pro", label: "Pro", color: "bg-primary" },
              { key: "premium", label: "Premium", color: "bg-accent" },
            ].map((p) => {
              const value = s.byPlan[p.key] || 0;
              const pct = s.artists ? Math.round((value / s.artists) * 100) : 0;
              return (
                <div key={p.key}>
                  <div className="flex justify-between text-[12px]">
                    <span className="font-medium">{p.label}</span>
                    <span className="text-muted-foreground">
                      {value} · {pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">À traiter</p>
          <div className="mt-4 space-y-2">
            <Row label="Abonnements en attente" value={s.pendingSubscriptions} to="/admin/monetisation" />
            <Row label="Mises en avant en attente" value={s.pendingPromotions} to="/admin/monetisation" />
            <Row label="Signalements ouverts" value={s.openReports} to="/admin/signalements" icon={Flag} />
            <Row label="Mises en avant actives" value={s.activePromotions} to="/admin/monetisation" />
          </div>
        </div>
      </div>

      {s.byCountry.length > 0 && (
        <div className="rounded-2xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">Talents par pays</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {s.byCountry.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5 text-[12.5px]"
              >
                <span>{c.name}</span>
                <span className="font-medium text-muted-foreground">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, to }) {
  const urgent = value > 0;
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-border px-4 py-3 text-[12.5px] transition-colors hover:border-foreground/25"
    >
      <span className="text-foreground/80">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={
            urgent
              ? "rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-foreground"
              : "rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-foreground/50"
          }
        >
          {value}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </Link>
  );
}