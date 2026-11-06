import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Archive, Loader2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/_authed/dashboard/demandes")({
  component: RequestsPage,
});

const TYPE_LABELS = {
  exposition: "Exposition",
  achat: "Achat d'œuvre",
  commande: "Commande",
  presse: "Presse",
  collaboration: "Collaboration",
  autre: "Autre",
};

function RequestsPage() {
  const { user } = useDashboard();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const load = useCallback(async () => {
    if (!user) return;
    const res = await base44.entities.ContactRequest.filter(
      { artist_user_id: user.id },
      { sort: "-created_date", limit: 100 }
    );
    setItems(Array.isArray(res) ? res : res?.items || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id, status) {
    await base44.entities.ContactRequest.update(id, { status });
    setItems((all) => all.map((i) => (i.id === id ? { ...i, status } : i)));
  }

  const filtered = items.filter((i) => {
    if (tab === "all") return i.status !== "archived";
    if (tab === "new") return i.status === "new";
    return i.status === "archived";
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Collaborations</p>
        <h1 className="mt-2 text-2xl font-semibold">Demandes de contact</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          Les messages envoyés depuis votre page publique.
        </p>
      </div>

      <div className="flex gap-2">
        {[
          { key: "all", label: "Actives" },
          { key: "new", label: "Non lues" },
          { key: "archived", label: "Archivées" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t.key
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground/70"
            }`}
          >
            {t.label}
            {t.key === "new" && items.filter((i) => i.status === "new").length > 0 && (
              <span className="ml-1.5 text-accent">
                {items.filter((i) => i.status === "new").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-[14px] font-medium">Aucune demande pour le moment.</p>
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Complétez votre profil et activez une mise en avant pour recevoir vos
            premières sollicitations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <article
              key={r.id}
              className={`rounded-xl border bg-background p-5 ${
                r.status === "new" ? "border-accent/50" : "border-border"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-medium">{r.subject}</p>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      {TYPE_LABELS[r.collaboration_type] || "Demande"}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    {r.sender_name} · {r.sender_email} ·{" "}
                    {new Date(r.created_date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {r.status !== "archived" && (
                    <>
                      {r.status === "new" ? (
                        <button
                          onClick={() => setStatus(r.id, "read")}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                        >
                          <MailOpen className="h-3 w-3" /> Marquer lu
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[11.5px] text-muted-foreground">
                          <MailOpen className="h-3 w-3" /> Lu
                        </span>
                      )}
                      <button
                        onClick={() => setStatus(r.id, "archived")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                      >
                        <Archive className="h-3 w-3" /> Archiver
                      </button>
                    </>
                  )}
                </div>
              </div>

              <p className="mt-3 whitespace-pre-line text-[13px] leading-relaxed text-foreground/80">
                {r.message}
              </p>

              <a
                href={`mailto:${r.sender_email}?subject=${encodeURIComponent(
                  `Re: ${r.subject}`
                )}`}
                className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary"
              >
                <Mail className="h-3.5 w-3.5" /> Répondre par email
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}