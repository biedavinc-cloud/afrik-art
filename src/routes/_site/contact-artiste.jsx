import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import CollaborationForm from "@/components/profile/CollaborationForm";
import { getPublicProfile, searchArtists } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/contact-artiste")({
  validateSearch: (s) => ({ slug: s.slug || undefined }),
  loaderDeps: ({ search }) => ({ slug: search.slug }),
  loader: async ({ deps }) => {
    const directory = await searchArtists({ data: {} });
    if (!deps.slug) return { profile: null, artists: directory.items.slice(0, 24) };
    const data = await getPublicProfile({ data: { slug: deps.slug } });
    return { profile: data?.profile || null, artists: directory.items.slice(0, 12) };
  },
  head: () => ({
    meta: [
      { title: "Contact collaboration | Afrik Art" },
      {
        name: "description",
        content:
          "Envoyez une demande de collaboration détaillée à un artiste africain : exposition, commande, campagne ou reportage.",
      },
    ],
  }),
  component: ContactArtistPage,
});

function ContactArtistPage() {
  const { profile, artists } = Route.useLoaderData();

  if (!profile) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <p className="label-caps">Contact</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
          Écrire à un artiste
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
          Choisissez le créateur que vous souhaitez solliciter. Chaque demande est transmise
          directement dans sa messagerie Afrik Art, avec copie par email.
        </p>

        {artists.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center text-[13.5px] text-muted-foreground">
            Aucun profil publié pour le moment.
          </p>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((a) => (
              <Link
                key={a.id}
                to="/contact-artiste"
                search={{ slug: a.slug }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-foreground/20"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {a.avatar_url ? (
                    <Image src={a.avatar_url} alt={a.display_name} className="h-full w-full" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-primary">
                      {a.display_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">{a.display_name}</p>
                  <p className="truncate text-[11.5px] text-muted-foreground">
                    {[a.primary_category, a.country].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <Link to="/contact-artiste" className="text-[12.5px] text-muted-foreground hover:text-foreground">
        ← Choisir un autre artiste
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="aspect-[4/3] bg-secondary">
              {profile.cover_url || profile.avatar_url ? (
                <Image
                  src={profile.cover_url || profile.avatar_url}
                  alt={profile.display_name}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary/10 text-[13px] text-primary">
                  {profile.display_name}
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-[15.5px] font-semibold">
                {profile.display_name}
                {profile.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {profile.primary_category}
                {profile.specialty ? ` · ${profile.specialty}` : ""}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {[profile.city, profile.country].filter(Boolean).join(", ") || "Non précisé"}
              </p>
              {profile.tagline && (
                <p className="mt-3 border-t border-border pt-3 text-[12.5px] leading-relaxed text-foreground/70">
                  {profile.tagline}
                </p>
              )}
              <Link
                to="/talents/$slug"
                params={{ slug: profile.slug }}
                className="mt-4 inline-block text-[12px] font-medium text-primary"
              >
                Voir le profil complet →
              </Link>
            </div>
          </div>
        </aside>

        <CollaborationForm profile={profile} />
      </div>
    </div>
  );
}