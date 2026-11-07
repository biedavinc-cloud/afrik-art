import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { requestSubscription } from "@/lib/server-fns";
import { cn } from "@/lib/utils";
import { PROVIDER_LABEL } from "@/lib/psp-catalog";

export const Route = createFileRoute("/_authed/dashboard/abonnement")({
  component: SubscriptionPage,
});

const STATUS_LABEL = {
  pending: "En attente de paiement",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

function SubscriptionPage() {
  const { profile, refresh } = useDashboard();
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState(null);

  const load = useCallback(async () => {
    const [planRes, payRes] = await Promise.all([
      base44.entities.PlanConfig.list({ sort: "sort", limit: 20 }),
      base44.entities.Payment.filter({}, { sort: "-created_date", limit: 50 }),
    ]);
    setPlans((Array.isArray(planRes) ? planRes : planRes?.items || []).filter((p) => p.active !== false));
    setPayments(Array.isArray(payRes) ? payRes : payRes?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function choose(plan) {
    setBusyPlan(plan.key);
    try {
      const res = await requestSubscription({ data: { plan: plan.key } });
      if (res.immediate) {
        toast.success("Votre formule a été mise à jour.");
        await refresh();
      } else {
        toast.success(
          res.provider
            ? `Demande enregistrée. Règlement via ${res.provider} ; activation dès confirmation.`
            : "Demande enregistrée. Votre formule sera activée dès confirmation du paiement."
        );
      }
      await load();
    } catch (err) {
      toast.error(err.message || "La demande n'a pas pu être enregistrée.");
    } finally {
      setBusyPlan(null);
    }
  }

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
        <p className="label-caps">Facturation</p>
        <h1 className="mt-2 text-2xl font-semibold">Mon abonnement</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Formule actuelle
          </p>
          <p className="mt-2 text-xl font-semibold capitalize">{profile.plan}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {profile.plan_status === "pending"
              ? "Activation en attente de confirmation du paiement."
              : profile.plan_ends_at
                ? `Renouvellement le ${new Date(profile.plan_ends_at).toLocaleDateString("fr-FR")}`
                : "Sans engagement, sans échéance."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Médias inclus
          </p>
          <p className="mt-2 text-xl font-semibold">
            {plans.find((p) => p.key === profile.plan)?.media_limit ?? 5}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const current = plan.key === profile.plan;
          return (
            <div
              key={plan.key}
              className={cn(
                "flex flex-col rounded-xl border p-6",
                current ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold">{plan.name}</p>
                {current && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground">
                    Actuelle
                  </span>
                )}
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {plan.price} $<span className="text-[12px] font-normal opacity-60"> / mois</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2">
                {(plan.features || []).map((f) => (
                  <li key={f} className="flex gap-2 text-[12px] leading-relaxed">
                    <Check className={cn("mt-0.5 h-3 w-3 shrink-0", current ? "text-accent" : "text-primary")} />
                    <span className={current ? "text-primary-foreground/80" : "text-foreground/75"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => choose(plan)}
                disabled={current || busyPlan === plan.key}
                className={cn(
                  "mt-6 rounded-full px-5 py-2.5 text-[12.5px] font-medium transition-colors disabled:opacity-60",
                  current
                    ? "bg-primary-foreground/10 text-primary-foreground"
                    : "bg-foreground text-background hover:bg-primary"
                )}
              >
                {busyPlan === plan.key
                  ? "Enregistrement…"
                  : current
                    ? "Formule active"
                    : plan.price === 0
                      ? "Revenir au gratuit"
                      : `Choisir ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="rounded-xl border border-border bg-secondary/40 px-5 py-4 text-[12px] leading-relaxed text-muted-foreground">
        Aucun prélèvement automatique : chaque changement de formule crée une demande avec
        son montant. La formule est activée après confirmation du paiement par l'équipe.
        Vous pouvez annuler à tout moment.
      </p>

      <div className="rounded-xl border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <p className="text-[13px] font-medium">Historique des paiements</p>
        </div>
        {payments.length === 0 ? (
          <p className="px-6 py-10 text-center text-[12.5px] text-muted-foreground">
            Aucun paiement enregistré.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {payments.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
                <div>
                  <p className="text-[12.5px] font-medium">{p.label}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {new Date(p.created_date).toLocaleDateString("fr-FR")} ·{" "}
                    {p.type === "boost" ? "Mise en avant" : "Abonnement"}
                    {p.provider ? ` · via ${PROVIDER_LABEL(p.provider)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12.5px] font-medium">{p.amount} $</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.1em]",
                      p.status === "paid"
                        ? "bg-primary/10 text-primary"
                        : p.status === "pending"
                          ? "bg-accent/20 text-foreground"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {STATUS_LABEL[p.status] || p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}