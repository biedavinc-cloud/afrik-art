import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Ban, CheckCircle2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authed/admin/artistes")({
  component: AdminArtists,
});

function AdminArtists() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const res = await api.entities.ArtistProfile.list({ sort: "-created_date", limit: 300 });
    setItems(Array.isArray(res) ? res : res?.items || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function update(id, patch) {
    await api.entities.ArtistProfile.update(id, patch);
    setItems((all) => all.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    toast.success("Profil mis à jour.");
  }

  const filtered = items.filter((p) => {
    if (!q) return true;
    const hay = `${p.display_name} ${p.primary_category} ${p.country} ${p.city}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Modération</p>
          <h1 className="mt-2 text-2xl font-semibold">Artistes</h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">{filtered.length} profil(s)</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un artiste"
            className="h-10 w-full pl-9 sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="divide-y divide-border">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/talents/$slug"
                    params={{ slug: p.slug }}
                    className="truncate text-[13px] font-medium hover:underline"
                  >
                    {p.display_name}
                  </Link>
                  {p.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                      p.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {p.status === "active" ? "Actif" : "Suspendu"}
                  </span>
                </div>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  {[p.primary_category, p.city, p.country].filter(Boolean).join(" · ")} ·{" "}
                  {p.views || 0} vues
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select value={p.plan} onValueChange={(v) => update(p.id, { plan: v })}>
                  <SelectTrigger className="h-8 w-28 text-[11.5px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={() => update(p.id, { verified: !p.verified })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {p.verified ? "Retirer badge" : "Vérifier"}
                </button>

                <button
                  onClick={() =>
                    update(p.id, { status: p.status === "active" ? "suspended" : "active" })
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11.5px] hover:bg-secondary"
                >
                  <Ban className="h-3 w-3" />
                  {p.status === "active" ? "Suspendre" : "Réactiver"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}