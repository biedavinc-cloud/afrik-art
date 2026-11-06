import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export const Route = createFileRoute("/_authed/admin/signalements")({
  component: AdminReports,
});

const REASON_LABEL = {
  contenu_inapproprie: "Contenu inapproprié",
  droits_auteur: "Droits d'auteur",
  usurpation: "Usurpation d'identité",
  spam: "Spam / arnaque",
  autre: "Autre",
};

function AdminReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await base44.entities.Report.list({ sort: "-created_date", limit: 100 });
    setItems(Array.isArray(res) ? res : res?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(id, status) {
    await base44.entities.Report.update(id, { status });
    setItems((all) => all.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success("Signalement mis à jour.");
  }

  async function suspend(profileId) {
    if (!profileId) return;
    await base44.entities.ArtistProfile.update(profileId, { status: "suspended" });
    toast.success("Profil suspendu.");
  }

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
        <p className="label-caps">Modération</p>
        <h1 className="mt-2 text-2xl font-semibold">Signalements</h1>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground">
          {items.filter((r) => r.status === "open").length} signalement(s) ouvert(s)
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center text-[13px] text-muted-foreground">
          Aucun signalement pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-background p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium">{REASON_LABEL[r.reason] || r.reason}</p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    {r.reporter_email || "Anonyme"} ·{" "}
                    {new Date(r.created_date).toLocaleDateString("fr-FR")}
                    {r.profile_slug && (
                      <>
                        {" · "}
                        <Link to="/talents/$slug" params={{ slug: r.profile_slug }} className="underline">
                          Voir le profil
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                    r.status === "open" ? "bg-accent/20" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {r.status === "open" ? "Ouvert" : r.status === "resolved" ? "Traité" : "Ignoré"}
                </span>
              </div>

              {r.details && (
                <p className="mt-3 whitespace-pre-line text-[12.5px] leading-relaxed text-foreground/80">
                  {r.details}
                </p>
              )}

              {r.status === "open" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatus(r.id, "resolved")}
                    className="rounded-full bg-foreground px-4 py-1.5 text-[11.5px] font-medium text-background"
                  >
                    Marquer traité
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "dismissed")}
                    className="rounded-full border border-border px-4 py-1.5 text-[11.5px]"
                  >
                    Ignorer
                  </button>
                  {r.profile_id && (
                    <button
                      onClick={() => suspend(r.profile_id)}
                      className="rounded-full border border-destructive/40 px-4 py-1.5 text-[11.5px] text-destructive"
                    >
                      Suspendre le profil
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}