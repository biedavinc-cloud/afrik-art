import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authed/admin/monetisation")({
  component: AdminMonetisation,
});

const asItems = (r) => (Array.isArray(r) ? r : r?.items || []);

function AdminMonetisation() {
  const [plans, setPlans] = useState([]);
  const [subs, setSubs] = useState([]);
  const [promos, setPromos] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  const load = useCallback(async () => {
    const [planRes, subRes, promoRes, payRes] = await Promise.all([
      base44.entities.PlanConfig.list({ sort: "sort", limit: 20 }),
      base44.entities.Subscription.list({ sort: "-created_date", limit: 100 }),
      base44.entities.Promotion.list({ sort: "-created_date", limit: 100 }),
      base44.entities.Payment.list({ sort: "-created_date", limit: 200 }),
    ]);
    setPlans(asItems(planRes));
    setSubs(asItems(subRes));
    setPromos(asItems(promoRes));
    setPayments(asItems(payRes));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function savePlan(plan) {
    setSaving(plan.id);
    try {
      await base44.entities.PlanConfig.update(plan.id, {
        price: Number(plan.price),
        media_limit: Number(plan.media_limit),
        categories_limit: Number(plan.categories_limit),
      });
      toast.success("Formule mise à jour.");
    } catch (err) {
      toast.error(err.message || "Échec de l'enregistrement.");
    } finally {
      setSaving(null);
    }
  }

  async function markPaid(payment, extra = {}) {
    await base44.entities.Payment.update(payment.id, {
      status: "paid",
      paid_at: new Date().toISOString(),
      ...extra,
    });
  }

  async function activateSubscription(sub) {
    const profile = await base44.entities.ArtistProfile.get(sub.profile_id).catch(() => null);
    const ends = new Date();
    ends.setMonth(ends.getMonth() + 1);
    await base44.entities.Subscription.update(sub.id, {
      status: "active",
      started_at: new Date().toISOString(),
      ends_at: ends.toISOString(),
    });
    if (profile) {
      await base44.entities.ArtistProfile.update(profile.id, {
        plan: sub.plan,
        plan_status: "active",
        plan_ends_at: ends.toISOString(),
      });
    }
    const payment = payments.find((p) => p.reference_id === sub.id && p.status === "pending");
    if (payment) await markPaid(payment);
    toast.success("Abonnement activé.");
    await load();
  }

  async function activatePromotion(promo) {
    const starts = new Date();
    const ends = new Date(starts.getTime() + promo.duration_hours * 3600000);
    await base44.entities.Promotion.update(promo.id, {
      status: "active",
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
    });
    const payment = payments.find((p) => p.reference_id === promo.id && p.status === "pending");
    if (payment) await markPaid(payment);
    toast.success("Mise en avant activée.");
    await load();
  }

  async function cancelPromotion(promo) {
    await base44.entities.Promotion.update(promo.id, { status: "canceled" });
    toast.success("Mise en avant annulée.");
    await load();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pendingSubs = subs.filter((s) => s.status === "pending");
  const pendingPromos = promos.filter((p) => p.status === "pending");

  return (
    <div className="space-y-7">
      <div>
        <p className="label-caps">Revenus</p>
        <h1 className="mt-2 text-2xl font-semibold">Monétisation</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Tarifs, demandes en attente et historique des paiements. Aucune prestation n'est
          activée sans confirmation manuelle.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-background p-6">
        <p className="text-[13px] font-medium">Tarifs des formules</p>
        <div className="mt-4 space-y-3">
          {plans.map((p) => (
            <div key={p.id} className="grid items-end gap-3 rounded-lg border border-border p-4 sm:grid-cols-[1fr_100px_110px_110px_auto]">
              <div>
                <p className="text-[13px] font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.tagline}</p>
              </div>
              <div>
                <Label className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">Prix $</Label>
                <Input
                  type="number"
                  min="0"
                  value={p.price}
                  onChange={(e) =>
                    setPlans((all) =>
                      all.map((x) => (x.id === p.id ? { ...x, price: e.target.value } : x))
                    )
                  }
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">Médias</Label>
                <Input
                  type="number"
                  min="1"
                  value={p.media_limit}
                  onChange={(e) =>
                    setPlans((all) =>
                      all.map((x) => (x.id === p.id ? { ...x, media_limit: e.target.value } : x))
                    )
                  }
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">Catégories</Label>
                <Input
                  type="number"
                  min="1"
                  value={p.categories_limit}
                  onChange={(e) =>
                    setPlans((all) =>
                      all.map((x) => (x.id === p.id ? { ...x, categories_limit: e.target.value } : x))
                    )
                  }
                  className="mt-1 h-9"
                />
              </div>
              <button
                onClick={() => savePlan(p)}
                disabled={saving === p.id}
                className="h-9 rounded-full bg-foreground px-4 text-[11.5px] font-medium text-background disabled:opacity-60"
              >
                {saving === p.id ? "…" : "Enregistrer"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <p className="text-[13px] font-medium">Abonnements en attente ({pendingSubs.length})</p>
        </div>
        {pendingSubs.length === 0 ? (
          <p className="px-6 py-8 text-center text-[12px] text-muted-foreground">Aucune demande.</p>
        ) : (
          <div className="divide-y divide-border">
            {pendingSubs.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
                <div>
                  <p className="text-[12.5px] font-medium capitalize">{s.plan} — {s.price} $</p>
                  <p className="text-[11px] text-muted-foreground">
                    Demande du {new Date(s.created_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() => activateSubscription(s)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[11.5px] font-medium text-primary-foreground"
                >
                  <Check className="h-3 w-3" /> Paiement reçu · activer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <p className="text-[13px] font-medium">Mises en avant en attente ({pendingPromos.length})</p>
        </div>
        {pendingPromos.length === 0 ? (
          <p className="px-6 py-8 text-center text-[12px] text-muted-foreground">Aucune demande.</p>
        ) : (
          <div className="divide-y divide-border">
            {pendingPromos.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
                <div>
                  <p className="text-[12.5px] font-medium">
                    {p.artist_name || "Artiste"} — {p.duration_label} ({p.price} $)
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.target_countries?.length || 0} pays · {p.target_categories?.length || 0} catégories
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => activatePromotion(p)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[11.5px] font-medium text-primary-foreground"
                  >
                    <Check className="h-3 w-3" /> Activer
                  </button>
                  <button
                    onClick={() => cancelPromotion(p)}
                    className="rounded-full border border-border px-4 py-1.5 text-[11.5px]"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <p className="text-[13px] font-medium">Paiements</p>
        </div>
        {payments.length === 0 ? (
          <p className="px-6 py-8 text-center text-[12px] text-muted-foreground">
            Aucun paiement enregistré.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {payments.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px]">{p.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.owner_email || "—"} · {new Date(p.created_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] font-medium">{p.amount} $</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                      p.status === "paid" ? "bg-primary/10 text-primary" : "bg-accent/20"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.status === "pending" && (
                    <button
                      onClick={async () => {
                        await markPaid(p);
                        toast.success("Paiement confirmé.");
                        await load();
                      }}
                      className="rounded-full border border-border px-3 py-1 text-[11px] hover:bg-secondary"
                    >
                      Marquer payé
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}