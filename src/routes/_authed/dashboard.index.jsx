import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Eye, Images, Inbox, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/_authed/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user, profile } = useDashboard();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || !profile) return;
    let active = true;
    (async () => {
      const [newContacts, artworks, promos, plans] = await Promise.all([
        base44.entities.ContactRequest.count({ artist_user_id: user.id, status: "new" }),
        base44.entities.Artwork.count({ profile_id: profile.id }),
        base44.entities.Promotion.filter({ profile_id: profile.id }, { limit: 20 }),
        base44.entities.PlanConfig.list({ limit: 20 }),
      ]);
      if (!active) return;
      const planList = Array.isArray(plans) ? plans : plans?.items || [];
      const config = planList.find((p) => p.key === profile.plan);
      const promoList = Array.isArray(promos) ? promos : promos?.items || [];
      setStats({
        newContacts,
        artworks,
        mediaLimit: config?.media_limit ?? 5,
        activePromo: promoList.find(
          (p) => p.status === "active" && new Date(p.ends_at || 0).getTime() > Date.now()
        ),
      });
    })();
    return () => {
      active = false;
    };
  }, [user, profile]);

  const completion = profileCompletion(profile);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Tableau de bord</p>
        <h1 className="mt-2 text-2xl font-semibold">Bonjour, {profile.display_name.split(" ")[0]}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Eye} label="Vues du profil" value={profile.views || 0} />
        <StatCard icon={Inbox} label="Nouvelles demandes" value={stats?.newContacts ?? "—"} />
        <StatCard
          icon={Images}
          label="Médias publiés"
          value={stats ? `${stats.artworks} / ${stats.mediaLimit}` : "—"}
        />
        <StatCard
          icon={Sparkles}
          label="Formule"
          value={profile.plan === "starter" ? "Starter" : profile.plan === "pro" ? "Pro" : "Premium"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium">Complétude du profil</p>
            <span className="text-[12px] text-muted-foreground">{completion}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
            Un profil complet (photo, couverture, biographie, portfolio, réseaux) remonte
            plus haut dans les résultats de recherche.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/dashboard/profil"
              className="rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background"
            >
              Modifier mon profil
            </Link>
            <Link
              to="/dashboard/portfolio"
              className="rounded-full border border-border px-4 py-2 text-[12px] font-medium"
            >
              Gérer mon portfolio
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <p className="text-[13px] font-medium">Visibilité</p>
          {stats?.activePromo ? (
            <>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                Mise en avant active jusqu'au{" "}
                {new Date(stats.activePromo.ends_at).toLocaleDateString("fr-FR")}.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <MiniStat label="Impr." value={stats.activePromo.impressions || 0} />
                <MiniStat label="Clics" value={stats.activePromo.clicks || 0} />
                <MiniStat label="Visites" value={stats.activePromo.visits || 0} />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                Aucune mise en avant en cours. Apparaissez en tête de l'accueil et des
                résultats dès 2 $.
              </p>
              <Link
                to="/dashboard/visibilite"
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary"
              >
                Booster mon profil <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-6">
        <p className="text-[13px] font-medium">Raccourcis</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            { label: "Consulter mes demandes de contact", to: "/dashboard/demandes" },
            { label: "Changer de formule", to: "/dashboard/abonnement" },
            { label: "Ajouter une œuvre", to: "/dashboard/portfolio" },
            { label: "Voir mon profil public", to: `/talents/${profile.slug}` },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-[12.5px] transition-colors hover:border-foreground/20"
            >
              {l.label}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function profileCompletion(p) {
  const checks = [
    p.avatar_url,
    p.cover_url,
    p.bio,
    p.tagline,
    p.specialty,
    p.website || p.instagram,
    p.contact_email,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
      <p className="mt-4 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-[11.5px] text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg bg-secondary/60 py-2">
      <p className="text-[14px] font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}