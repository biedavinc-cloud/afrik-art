import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { getSuperadminPayments, settlePayment } from "@/lib/admin-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/admin/paiements")({
  loader: () => getSuperadminPayments(),
  head: () => ({ meta: [{ title: "Superadmin · Paiements | Afrik Art" }] }),
  component: PaymentsPage,
});

const STATUS_STYLES = {
  pending: "bg-accent/20 text-foreground",
  paid: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
  refunded: "bg-secondary text-foreground/70",
};

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "pending", label: "En attente" },
  { key: "paid", label: "Payés" },
  { key: "failed", label: "Échoués" },
];

function PaymentsPage() {
  const { items, totals } = Route.useLoaderData();
  const router = useRouter();
  const settle = useServerFn(settlePayment);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const visible = filter === "all" ? items : items.filter((p) => p.status === filter);

  async function act(payment, outcome) {
    setBusyId(payment.id);
    try {
      await settle({ data: { paymentId: payment.id, outcome } });
      toast.success(
        outcome === "paid"
          ? "Paiement validé, la prestation est activée."
          : "Paiement marqué comme échoué."
      );
      router.invalidate();
    } catch (error) {
      toast.error(error?.message || "Opération impossible.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="label-caps">Superadmin</p>
        <h1 className="mt-2 text-2xl font-semibold">Paiements</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Validez les règlements reçus pour activer un abonnement ou une mise en avant.
          Tant qu'un paiement est en attente, la prestation reste inactive.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Encaissé (USD)" value={`${totals.revenue} $`} />
        <Stat label="En attente" value={totals.pending} />
        <Stat label="Abonnements" value={totals.subscriptions} />
        <Stat label="Mises en avant" value={totals.boosts} />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors",
              filter === f.key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13.5px] font-medium">{p.label}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
                    STATUS_STYLES[p.status] || STATUS_STYLES.refunded
                  )}
                >
                  {p.status === "pending"
                    ? "En attente"
                    : p.status === "paid"
                      ? "Payé"
                      : p.status === "failed"
                        ? "Échoué"
                        : "Remboursé"}
                </span>
                {p.target && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-foreground/60">
                    {p.target.kind === "subscription" ? "Abonnement" : "Mise en avant"}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                {p.owner_email || "—"}
                {p.created_date &&
                  ` · ${new Date(p.created_date).toLocaleDateString("fr-FR")}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-[17px] font-semibold">
                {p.amount} {p.currency || "USD"}
              </p>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => act(p, "paid")}
                    disabled={busyId === p.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background disabled:opacity-60"
                  >
                    <Check className="h-3.5 w-3.5" /> Valider
                  </button>
                  <button
                    onClick={() => act(p, "failed")}
                    disabled={busyId === p.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[12px] font-medium disabled:opacity-60"
                  >
                    <X className="h-3.5 w-3.5" /> Refuser
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-[13px] text-muted-foreground">
            Aucun paiement dans cette catégorie.
          </p>
        )}
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