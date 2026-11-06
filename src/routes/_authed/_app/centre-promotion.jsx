import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, Megaphone, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { BOOST_PACKAGES } from "@/lib/plans";
import { requestBoost } from "@/lib/server-fns";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_app/centre-promotion")({
  head: () => ({ meta: [{ title: "Centre promotion | Afrik Art" }] }),
  component: PromotionCenterPage,
});

const asItems = (res) => (Array.isArray(res) ? res : res?.items || []);

function PromotionCenterPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [promos, setPromos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hours, setHours] = useState(168);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const profiles = asItems(await base44.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 }));
      const p = profiles[0] || null;
      setProfile(p);
      if (p) {
        const [arts, pr] = await Promise.all([
          base44.entities.Artwork.filter({ profile_id: p.id }, { sort: "sort", limit: 60 }),
          base44.entities.Promotion.filter({ profile_id: p.id }, { sort: "-created_date", limit: 20 }),
        ]);
        setArtworks(asItems(arts));
        setPromos(asItems(pr));
        setSelected(asItems(arts).slice(0, 3).map((a) => a.id));
      }
      setLoading(false);
    })().catch(() => setLoading(false));
  }, [user]);

  function toggle(id) {
    setSelected((all) => (all.includes(id) ? all.filter((x) => x !== id) : [...all, id]));
  }

  async function saveSelection() {
    if (!profile) return;
    setSaving(true);
    try {
      await Promise.all(
        artworks.map((art) => {
          const index = selected.indexOf(art.id);
          const sort = index === -1 ? 100 + artworks.indexOf(art) : index;
          return sort === art.sort ? null : base44.entities.Artwork.update(art.id, { sort });
        })
      );
      toast.success("Sélection enregistrée : ces œuvres apparaissent en premier.");
    } catch {
      toast.error("L'enregistrement a échoué.");
    } finally {
      setSaving(false);
    }
  }

  async function subscribe() {
    if (!profile) return;
    setBusy(true);
    try {
      const res = await requestBoost({ data: { profileId: profile.id, hours } });
      toast.success(`Mise en avant demandée — ${res.price} USD. Activation après paiement.`);
      const pr = await base44.entities.Promotion.filter(
        { profile_id: profile.id },
        { sort: "-created_date", limit: 20 }
      );
      setPromos(asItems(pr));
    } catch (err) {
      toast.error(err.message || "La demande a échoué.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pack = BOOST_PACKAGES.find((p) => p.hours === hours);

  return (
    <div className="space-y-7">
      <div>
        <p className="label-caps">Visibilité</p>
        <h1 className="mt-2 text-2xl font-semibold">Centre de promotion</h1>
        <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
          Choisissez vos œuvres vitrines, puis programmez une mise en avant : votre profil apparaît
          en tête de l'accueil, des résultats et des pages catégories, avec la mention
          « Sponsorisé ».
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[14.5px] font-medium">1. Vos œuvres vitrines</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Les œuvres sélectionnées remontent en tête de votre portfolio public.
            </p>
          </div>
          <p className="text-[11.5px] text-muted-foreground">{selected.length} sélectionnée(s)</p>
        </div>

        {artworks.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-border py-10 text-center text-[12.5px] text-muted-foreground">
            Ajoutez d'abord des œuvres à votre portfolio.
          </p>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {artworks.map((art) => {
                const index = selected.indexOf(art.id);
                return (
                  <button
                    key={art.id}
                    onClick={() => toggle(art.id)}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-xl border-2 bg-secondary transition-colors",
                      index > -1 ? "border-primary" : "border-transparent"
                    )}
                  >
                    {art.image_url ? (
                      <Image src={art.image_url} alt={art.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center px-2 text-[10.5px] text-muted-foreground">
                        {art.title}
                      </span>
                    )}
                    {index > -1 && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={saveSelection}
              disabled={saving}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[12.5px] font-medium disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Enregistrer la sélection
            </button>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <p className="text-[14.5px] font-medium">2. Durée de la mise en avant</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BOOST_PACKAGES.map((p) => (
            <button
              key={p.hours}
              onClick={() => setHours(p.hours)}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors",
                hours === p.hours ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"
              )}
            >
              <p className="text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
                {p.label}
              </p>
              <p className="mt-2 text-[22px] font-semibold">
                {p.price} <span className="text-[13px] font-normal">USD</span>
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="max-w-md text-[12px] leading-relaxed text-muted-foreground">
            La demande crée une facture dans votre historique. La mise en avant démarre dès la
            confirmation du paiement et s'arrête automatiquement à la fin de la période.
          </p>
          <button
            onClick={subscribe}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[12.5px] font-medium text-background disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Mettre en avant — {pack?.price} USD
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <p className="text-[14.5px] font-medium">Mes mises en avant</p>
        {promos.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border py-10 text-center text-[12.5px] text-muted-foreground">
            Aucune mise en avant programmée.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div>
                  <p className="text-[12.5px] font-medium">{promo.duration_label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {promo.price} USD · {promo.impressions || 0} impressions · {promo.clicks || 0}{" "}
                    clics · {promo.visits || 0} visites
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em]",
                    promo.status === "active"
                      ? "bg-primary/10 text-primary"
                      : promo.status === "pending"
                        ? "bg-secondary text-foreground/70"
                        : "bg-secondary text-muted-foreground"
                  )}
                >
                  {promo.status === "active"
                    ? "Active"
                    : promo.status === "pending"
                      ? "En attente"
                      : promo.status}
                </span>
              </div>
            ))}
          </div>
        )}
        <Link to="/factures" className="mt-4 inline-block text-[12px] font-medium text-primary">
          Voir mes factures →
        </Link>
      </section>
    </div>
  );
}