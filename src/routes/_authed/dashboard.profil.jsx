import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
import ImageUpload from "@/components/dashboard/ImageUpload";
import ProfileFields from "@/components/dashboard/ProfileFields";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export const Route = createFileRoute("/_authed/dashboard/profil")({
  loader: async () => {
    const [catRes, planRes] = await Promise.all([
      api.entities.Category.list({ sort: "sort", limit: 60 }),
      api.entities.PlanConfig.list({ limit: 20 }),
    ]);
    const toItems = (r) => (Array.isArray(r) ? r : r?.items || []);
    return {
      categories: toItems(catRes).filter((c) => c.active !== false),
      plans: toItems(planRes),
    };
  },
  component: ProfilePage,
});

function ProfilePage() {
  const { categories, plans } = Route.useLoaderData();
  const { profile, refresh } = useDashboard();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...profile, categories: profile.categories || [] });
  }, [profile]);

  if (!form) return null;

  const config = plans.find((p) => p.key === profile.plan);
  const maxCategories = config?.categories_limit ?? 1;

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.entities.ArtistProfile.update(profile.id, {
        display_name: form.display_name,
        tagline: form.tagline,
        bio: form.bio,
        country: form.country,
        city: form.city,
        primary_category: form.primary_category,
        categories: (form.categories || []).filter((c) => c !== form.primary_category),
        specialty: form.specialty,
        availability: form.availability,
        avatar_url: form.avatar_url,
        cover_url: form.cover_url,
        website: form.website,
        instagram: form.instagram,
        behance: form.behance,
        youtube: form.youtube,
        contact_email: form.contact_email,
      });
      await refresh();
      toast.success("Profil mis à jour.");
    } catch (err) {
      toast.error(err.message || "La mise à jour a échoué.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Profil public</p>
          <h1 className="mt-2 text-2xl font-semibold">Mon profil</h1>
        </div>
        <Link
          to="/talents/$slug"
          params={{ slug: profile.slug }}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary"
        >
          Voir la page publique <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <form onSubmit={save} className="space-y-7 rounded-xl border border-border bg-background p-6">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <ImageUpload
            label="Photo de profil"
            value={form.avatar_url}
            onChange={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
            ratio="aspect-square"
          />
          <ImageUpload
            label="Couverture"
            value={form.cover_url}
            onChange={(url) => setForm((f) => ({ ...f, cover_url: url }))}
            ratio="aspect-[16/7]"
            hint="Images stockées publiquement — toute personne disposant du lien peut les ouvrir."
          />
        </div>

        <ProfileFields
          form={form}
          setForm={setForm}
          categories={categories}
          maxCategories={maxCategories}
        />

        <div className="flex items-center justify-between border-t border-border pt-5">
          <p className="text-[11.5px] text-muted-foreground">
            Adresse publique : /talents/{profile.slug}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[12.5px] font-medium text-background hover:bg-primary disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}