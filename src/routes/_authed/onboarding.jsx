import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ImageUpload from "@/components/dashboard/ImageUpload";
import ProfileFields from "@/components/dashboard/ProfileFields";
import { makeSlug } from "@/lib/slug";

export const Route = createFileRoute("/_authed/onboarding")({
  loader: async () => {
    const res = await base44.entities.Category.list({ sort: "sort", limit: 60 });
    const items = Array.isArray(res) ? res : res?.items || [];
    return { categories: items.filter((c) => c.active !== false) };
  },
  head: () => ({ meta: [{ title: "Créer mon profil | Afrik Art" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { categories } = Route.useLoaderData();
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ availability: "available", categories: [] });

  useEffect(() => {
    if (isLoadingAuth || !user) return;
    let active = true;
    base44.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 }).then((res) => {
      if (!active) return;
      const items = Array.isArray(res) ? res : res?.items || [];
      if (items[0]) navigate({ to: "/dashboard" });
      else setChecking(false);
    });
    return () => {
      active = false;
    };
  }, [user, isLoadingAuth, navigate]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.display_name || !form.primary_category || !form.country || !form.city) {
      setError("Renseignez votre nom professionnel, votre discipline, votre pays et votre ville.");
      return;
    }
    setBusy(true);
    try {
      await base44.entities.ArtistProfile.create({
        user_id: user.id,
        display_name: form.display_name,
        slug: makeSlug(form.display_name),
        tagline: form.tagline || "",
        bio: form.bio || "",
        country: form.country,
        city: form.city,
        primary_category: form.primary_category,
        categories: (form.categories || []).filter((c) => c !== form.primary_category),
        specialty: form.specialty || "",
        availability: form.availability || "available",
        avatar_url: form.avatar_url || "",
        cover_url: form.cover_url || "",
        website: form.website || "",
        instagram: form.instagram || "",
        behance: form.behance || "",
        youtube: form.youtube || "",
        contact_email: form.contact_email || "",
        plan: "starter",
        plan_status: "active",
        verified: false,
        status: "active",
        views: 0,
      });
      toast.success("Votre profil est en ligne.");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err.message || "La création du profil a échoué.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:py-16">
      <p className="label-caps">Bienvenue</p>
      <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight">
        Créez votre profil public
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        Ces informations constituent votre page publique. Vous pourrez les modifier à
        tout moment depuis votre espace.
      </p>

      <form onSubmit={submit} className="mt-10 space-y-8">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <ImageUpload
            label="Photo de profil"
            value={form.avatar_url}
            onChange={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
            ratio="aspect-square"
          />
          <ImageUpload
            label="Image de couverture"
            value={form.cover_url}
            onChange={(url) => setForm((f) => ({ ...f, cover_url: url }))}
            ratio="aspect-[16/7]"
            hint="Format paysage recommandé. Les images sont stockées publiquement — toute personne disposant du lien peut les ouvrir."
          />
        </div>

        <ProfileFields form={form} setForm={setForm} categories={categories} maxCategories={1} />

        {error && <p className="text-[13px] text-destructive">{error}</p>}

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] text-muted-foreground">
            Formule Starter gratuite — 5 médias, profil public indexé.
          </p>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-[13px] font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Publier mon profil
          </button>
        </div>
      </form>
    </div>
  );
}