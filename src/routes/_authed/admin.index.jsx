import { createFileRoute, Link } from "@tanstack/react-router";
import { getAdminOverview } from "@/lib/server-fns";

export const Route = createFileRoute("/_authed/admin/")({
  loader: () => getAdminOverview(),
  component: AdminOverview,
});

function AdminOverview() {
  const s = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Pilotage</p>
        <h1 className="mt-2 text-2xl font-semibold">Vue d'ensemble</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Artistes inscrits" value={s.artists} hint={`${s.activeArtists} actifs`} />
        <Stat label="Comptes utilisateurs" value={s.users} hint={`${s.suspended} suspendus`} />
        <Stat label="Œuvres publiées" value={s.artworks} hint={`${s.verified} profils vérifiés`} />
        <Stat label="Revenus confirmés" value={`${s.revenue} $`} hint={`${s.pendingPayments} paiements en attente`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">Répartition des formules</p>
          <div className="mt-5 space-y-3">
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
                    <span>{p.label}</span>
                    <span className="text-muted-foreground">
                      {value} · {pct}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${p.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">À traiter</p>
          <div className="mt-4 space-y-2">
            <Row label="Abonnements en attente" value={s.pendingSubscriptions} to="/admin/monetisation" />
            <Row label="Mises en avant en attente" value={s.pendingPromotions} to="/admin/monetisation" />
            <Row label="Signalements ouverts" value={s.openReports} to="/admin/signalements" />
            <Row label="Mises en avant actives" value={s.activePromotions} to="/admin/monetisation" />
          </div>
        </div>
      </div>

      {s.byCountry.length > 0 && (
        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">Talents par pays</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {s.byCountry.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5 text-[12.5px]">
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-[11.5px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function Row({ label, value, to }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-[12.5px] transition-colors hover:border-foreground/20"
    >
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </Link>
  );
}