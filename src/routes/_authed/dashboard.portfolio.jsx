import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/_authed/dashboard/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { profile } = useDashboard();
  const [artworks, setArtworks] = useState([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    if (!profile) return;
    const [artRes, planRes] = await Promise.all([
      base44.entities.Artwork.filter({ profile_id: profile.id }, { limit: 300, sort: "sort" }),
      base44.entities.PlanConfig.list({ limit: 20 }),
    ]);
    const arts = Array.isArray(artRes) ? artRes : artRes?.items || [];
    const plans = Array.isArray(planRes) ? planRes : planRes?.items || [];
    const config = plans.find((p) => p.key === profile.plan);
    setArtworks(arts);
    setLimit(config?.media_limit ?? 5);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.plan]);

  async function addFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = limit - artworks.length;
    if (remaining <= 0) {
      toast.error(`Votre formule ${profile.plan} est limitée à ${limit} médias.`);
      return;
    }
    setUploading(true);
    try {
      const selected = files.slice(0, remaining);
      let index = artworks.length;
      for (const file of selected) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} dépasse 10 Mo et a été ignoré.`);
          continue;
        }
        const res = await base44.integrations.Core.UploadPublicFile({ file });
        await base44.entities.Artwork.create({
          profile_id: profile.id,
          owner_user_id: profile.user_id || "",
          title: file.name.replace(/\.[^.]+$/, ""),
          media_type: "photo",
          image_url: res.file_url,
          category: profile.primary_category,
          sort: index++,
        });
      }
      await load();
      toast.success("Médias ajoutés.");
    } catch (err) {
      toast.error(err.message || "L'envoi a échoué.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id) {
    if (!window.confirm("Supprimer définitivement ce média ?")) return;
    await base44.entities.Artwork.delete(id);
    setArtworks((a) => a.filter((x) => x.id !== id));
    toast.success("Média supprimé.");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const used = artworks.length;
  const remaining = Math.max(limit - used, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Portfolio</p>
          <h1 className="mt-2 text-2xl font-semibold">Mes œuvres</h1>
          <p className="mt-1.5 text-[12.5px] text-muted-foreground">
            {used} / {limit} médias utilisés · {remaining} disponible{remaining > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <AddVideoDialog profile={profile} onAdded={load} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading || remaining === 0}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background hover:bg-primary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Ajouter des photos
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={addFiles}
            className="hidden"
          />
        </div>
      </div>

      {remaining === 0 && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 text-[12.5px]">
          Limite de votre formule atteinte. Passez à une formule supérieure pour publier
          davantage de médias.
        </div>
      )}

      {artworks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-20 text-center">
          <p className="text-[14px] font-medium">Votre portfolio est vide.</p>
          <p className="mt-2 text-[12.5px] text-muted-foreground">
            Ajoutez vos premières images : elles apparaîtront sur votre page publique.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((a) => (
            <div key={a.id} className="group overflow-hidden rounded-xl border border-border bg-background">
              <div className="relative aspect-[4/3] bg-secondary">
                {a.media_type === "video" ? (
                  <a
                    href={a.video_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex h-full w-full flex-col items-center justify-center gap-2 text-[12px] text-muted-foreground"
                  >
                    <Play className="h-6 w-6" /> Voir la vidéo
                  </a>
                ) : a.image_url ? (
                  <Image src={a.image_url} alt={a.title} className="h-full w-full" />
                ) : null}
                <button
                  onClick={() => remove(a.id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="truncate text-[12.5px] font-medium">{a.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {a.media_type === "video" ? "Vidéo" : "Photo"}
                  {a.year ? ` · ${a.year}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddVideoDialog({ profile, onAdded }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", video_url: "", description: "" });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await base44.entities.Artwork.create({
        profile_id: profile.id,
        owner_user_id: profile.user_id || "",
        title: form.title,
        description: form.description,
        media_type: "video",
        video_url: form.video_url,
        category: profile.primary_category,
      });
      toast.success("Vidéo ajoutée.");
      setOpen(false);
      setForm({ title: "", video_url: "", description: "" });
      await onAdded();
    } catch (err) {
      toast.error(err.message || "Impossible d'ajouter la vidéo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-[12.5px] font-medium">
          <Plus className="h-4 w-4" /> Vidéo
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Ajouter une vidéo</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="mt-2 space-y-4">
          <div>
            <Label htmlFor="v-title">Titre *</Label>
            <Input
              id="v-title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="v-url">Lien de la vidéo *</Label>
            <Input
              id="v-url"
              required
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={form.video_url}
              onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="v-desc">Description</Label>
            <Input
              id="v-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1.5"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background hover:bg-primary disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Ajouter
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}