import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { requestBoost } from "@/lib/server-fns";
import { BOOST_PACKAGES } from "@/lib/plans";
import { COUNTRIES } from "@/lib/slug";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/dashboard/visibilite")({
  component: VisibilityPage,
});

const STATUS_LABEL = {
  pending: "En attente de paiement",
  active: "Active",
  expired: "Expirée",
  canceled: "Annulée",
};

function remaining(promo) {
  const end = new Date(promo.ends_at || 0).getTime();
  const diff = end - Date.now();
  if (diff <= 0) return "Terminée";
  const hours = Math.floor(diff / 3600000);
  if (hours >= 24) return `${Math.floor(hours / 24)} jour(s) restant(s)`;
  return `${hours} h restantes`;
}

function VisibilityPage() {
  const { profile } = useDashboard();
  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [hours, setHours] = useState(168);
  const [countries, setCountries] = useState([]);
  const [cats, setCats] = useState([]);

  const load = useCallback(async () => {
    if (!profile) return;
    const [promoRes, catRes] = await Promise.all([
      base44.entities.Promotion.filter({ profile_id: profile.id }, { sort: "-created_date", limit: 50 }),
      base44.entities.Category.list({ sort: "sort", limit: 60 }),
    ]);
    setPromos(Array.isArray(promoRes) ? promoRes : promoRes?.items || []);
    setCategories(Array.isArray(catRes) ? catRes : catRes?.items || []);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    load();
  }, [load]);

  const pack = BOOST_PACKAGES.find((p) => p.hours === hours) || BOOST_PACKAGES[2];

  async function submit() {
    setBusy(true);
    try {
      await requestBoost({
        data: { profileId: profile.id, hours: pack.hours, countries, categories: cats },
      });
      toast.success(
        "Demande enregistrée. La mise en avant démarre dès confirmation du paiement."
      );
      await load();
    } catch (err) {
      toast.error(err.message || "La demande n'a pas pu être enregistrée.");
    } finally {
      setBusy(false);
    }
  }

  const active = promos.find(
    (p) => p.status === "active" && new Date(p.ends_at || 0).getTime() > Date.now()
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="label-caps">Visibilité</p>
        <h1 className="mt-2 text-2xl font-semibold">Mettre mon profil en avant</h1>
        <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">
          Votre profil apparaît en tête de l'accueil, des résultats de recherche et des
          pages catégories, avec un badge « Sponsorisé ».
        </p>
      </div>

      {active && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[13px] font-medium">
                <Sparkles className="h-4 w-4 text-accent" /> Mise en avant active
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {remaining(active)} · jusqu'au{" "}
                {new Date(active.ends_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric label="Impressions" value={active.impressions || 0} />
              <Metric label="Clics" value={active.clicks || 0} />
              <Metric label="Visites" value={active.visits || 0} />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-background p-6">
        <p className="text-[13px] font-medium">1. Durée de la mise en avant</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {BOOST_PACKAGES.map((b) => (
            <button
              key={b.hours}
              onClick={() => setHours(b.hours)}
              className={cn(
                "rounded-lg border px-4 py-3 text-left transition-colors",
                hours === b.hours
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-foreground/25"
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.12em] opacity-60">{b.label}</p>
              <p className="mt-1.5 text-lg font-semibold">{b.price} $</p>
            </button>
          ))}
        </div>

        <p className="mt-7 text-[13px] font-medium">2. Ciblage (optionnel)</p>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          Sans sélection, la mise en avant s'applique à tous les pays et toutes les disciplines.
        </p>

        <div className="mt-4">
          <p className="text-[11.5px] font-medium text-foreground/70">Pays</p>
          <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-lg border border-border p-3">
            {COUNTRIES.slice(0, 54).map((c) => {
              const on = countries.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setCountries((all) => (on ? all.filter((x) => x !== c) : [...all, c]))
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/70 hover:border-foreground/30"
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11.5px] font-medium text-foreground/70">Catégories</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = cats.includes(c.name);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    setCats((all) => (on ? all.filter((x) => x !== c.name) : [...all, c.name]))
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/70 hover:border-foreground/30"
                  )}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Total à régler
            </p>
            <p className="mt-1 text-2xl font-semibold">{pack.price} $</p>
          </div>
          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-[13px] font-medium text-background hover:bg-primary disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirmer ma demande
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Aucun prélèvement automatique. La promotion démarre après confirmation du
          paiement par l'équipe et expire automatiquement à la fin de la période.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <p className="text-[13px] font-medium">Mes mises en avant</p>
        </div>
        {promos.length === 0 ? (
          <p className="px-6 py-10 text-center text-[12.5px] text-muted-foreground">
            Aucune mise en avant demandée.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {promos.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="text-[12.5px] font-medium">{p.duration_label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {p.price} $ ·{" "}
                    {p.status === "active" ? remaining(p) : STATUS_LABEL[p.status] || p.status}
                    {p.target_countries?.length
                      ? ` · ${p.target_countries.length} pays ciblés`
                      : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[11.5px] text-muted-foreground">
                  <span>{p.impressions || 0} impr.</span>
                  <span>{p.clicks || 0} clics</span>
                  <span>{p.visits || 0} visites</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[15px] font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}