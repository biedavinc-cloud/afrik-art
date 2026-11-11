import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { useAuth } from "@/lib/AuthContext";
import ImageUpload from "@/components/dashboard/ImageUpload";
import ProfileFields from "@/components/dashboard/ProfileFields";
import { makeSlug } from "@/lib/slug";

export const Route = createFileRoute("/_authed/onboarding")({
  loader: async () => {
    const res = await api.entities.Category.list({ sort: "sort", limit: 60 });
    const items = Array.isArray(res) ? res : res?.items || [];
    return { categories: items.filter((c) => c.active !== false) };
  },
  head: () => ({ meta: [{ title: "Créer mon profil | Afrik Art" }] }),
  component: OnboardingPage,
});

const STEPS = ["Identité visuelle", "Informations", "Publication"];

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
    api.entities.ArtistProfile.filter({ user_id: user.id }, { limit: 1 }).then((res) => {
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
      await api.entities.ArtistProfile.create({
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
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-4xl px-5 py-12 lg:py-16">
        <div className="rounded-3xl border border-border bg-background p-7 lg:p-10">
          <p className="label-caps">Bienvenue</p>
          <h1 className="mt-3 font-heading text-[clamp(1.7rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight">
            Créez votre profil public
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Trois minutes suffisent pour ouvrir votre page dédiée : elle sera partageable,
            référencée et accessible aux galeries comme aux collectionneurs.
          </p>

          <ol className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={
                    i === 0
                      ? "flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[10.5px] font-semibold text-background"
                      : "flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10.5px] font-semibold text-muted-foreground"
                  }
                >
                  {i === 0 ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={
                    i === 0
                      ? "text-[12px] font-medium"
                      : "text-[12px] text-muted-foreground"
                  }
                >
                  {step}
                </span>
                {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
              </li>
            ))}
          </ol>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-5">
          <section className="rounded-3xl border border-border bg-background p-7 lg:p-8">
            <h2 className="text-[14px] font-medium">Votre visage et votre accroche</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Une photo nette et une couverture large donnent immédiatement du relief à votre page.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-[160px_1fr]">
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
          </section>

          <section className="rounded-3xl border border-border bg-background p-7 lg:p-8">
            <h2 className="text-[14px] font-medium">Vos informations publiques</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Discipline, ville, biographie : ce que voient les visiteurs et les moteurs de
              recherche.
            </p>
            <div className="mt-6">
              <ProfileFields form={form} setForm={setForm} categories={categories} maxCategories={1} />
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-background p-7 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[14px] font-medium">Publier votre profil</h2>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Formule Starter gratuite — 5 médias, profil public indexé, sans engagement.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-[13px] font-medium text-background transition-colors hover:bg-primary disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Publier mon profil
              </button>
            </div>
            {error && <p className="mt-4 text-[13px] text-destructive">{error}</p>}
          </section>
        </form>
      </div>
    </div>
  );
}