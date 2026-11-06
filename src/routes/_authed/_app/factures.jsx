import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { listMyInvoices } from "@/lib/content-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authed/_app/factures")({
  head: () => ({ meta: [{ title: "Mes factures | Afrik Art" }] }),
  component: InvoicesPage,
});

const STATUS = {
  paid: { label: "Payée", class: "bg-primary/10 text-primary" },
  pending: { label: "En attente", class: "bg-secondary text-foreground/70" },
  failed: { label: "Échouée", class: "bg-destructive/10 text-destructive" },
  refunded: { label: "Remboursée", class: "bg-secondary text-muted-foreground" },
};

const TYPE = { subscription: "Abonnement", boost: "Mise en avant" };

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyInvoices()
      .then((res) => {
        setInvoices(res.items || []);
        setEmail(res.email || "");
      })
      .catch(() => toast.error("Impossible de charger vos factures."))
      .finally(() => setLoading(false));
  }, []);

  async function download(payment) {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const ref = `AA-${payment.id.slice(0, 8).toUpperCase()}`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("AFRIK ART", 20, 24);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Plateforme panafricaine des talents", 20, 30);
      doc.text("Développé par Liaffrik Tech — Dubaï · Yaoundé", 20, 35);

      doc.setFontSize(14);
      doc.text(`Facture ${ref}`, 20, 55);
      doc.setFontSize(10);
      doc.text(`Date : ${formatDate(payment.created_date)}`, 20, 65);
      doc.text(`Client : ${payment.owner_email || email}`, 20, 71);
      doc.text(`Statut : ${STATUS[payment.status]?.label || payment.status}`, 20, 77);

      doc.setDrawColor(220);
      doc.line(20, 86, 190, 86);
      doc.setFontSize(11);
      doc.text(payment.label || TYPE[payment.type] || "Prestation", 20, 96);
      doc.text(`${payment.amount || 0} ${payment.currency || "USD"}`, 170, 96, { align: "right" });
      doc.line(20, 102, 190, 102);
      doc.setFont("helvetica", "bold");
      doc.text("Total", 20, 112);
      doc.text(`${payment.amount || 0} ${payment.currency || "USD"}`, 170, 112, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Aucune TVA applicable. Document généré automatiquement.", 20, 130);
      doc.save(`facture-afrik-art-${ref}.pdf`);
    } catch {
      toast.error("La génération du PDF a échoué.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const total = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Comptabilité</p>
        <h1 className="mt-2 text-2xl font-semibold">Historique des factures</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Abonnements et mises en avant réglés depuis votre compte.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Factures" value={invoices.length} />
        <Stat label="Total réglé" value={`${total} USD`} />
        <Stat label="En attente" value={invoices.filter((i) => i.status === "pending").length} />
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <Receipt className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-[14px] font-medium">Aucune facture pour l'instant.</p>
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Vos abonnements et mises en avant apparaîtront ici.
          </p>
          <Link
            to="/tarifs"
            className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
          >
            Voir les formules
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="hidden grid-cols-[1.6fr_0.9fr_0.8fr_0.8fr_auto] gap-4 border-b border-border px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:grid">
            <span>Prestation</span>
            <span>Date</span>
            <span>Montant</span>
            <span>Statut</span>
            <span />
          </div>
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="grid gap-2 border-b border-border/70 px-5 py-4 last:border-0 sm:grid-cols-[1.6fr_0.9fr_0.8fr_0.8fr_auto] sm:items-center sm:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {invoice.label || TYPE[invoice.type] || "Prestation"}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {TYPE[invoice.type] || invoice.type} · AA-{invoice.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <p className="text-[12.5px] text-muted-foreground">{formatDate(invoice.created_date)}</p>
              <p className="text-[13px] font-medium">
                {invoice.amount} {invoice.currency || "USD"}
              </p>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-[0.08em]",
                  STATUS[invoice.status]?.class
                )}
              >
                {STATUS[invoice.status]?.label || invoice.status}
              </span>
              <button
                onClick={() => download(invoice)}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] font-medium hover:bg-secondary"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background px-5 py-4">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-[20px] font-semibold">{value}</p>
    </div>
  );
}