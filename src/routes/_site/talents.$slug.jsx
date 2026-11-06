import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Globe,
  Instagram,
  Link2,
  MapPin,
  Play,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image";
import ContactDialog from "@/components/profile/ContactDialog";
import ReportDialog from "@/components/profile/ReportDialog";
import { getPublicProfile, recordProfileView } from "@/lib/server-fns";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/talents/$slug")({
  loader: async ({ params }) => {
    const data = await getPublicProfile({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.profile;
    if (!p) return { meta: [{ title: "Profil | Afrik Art" }] };
    const title = `${p.display_name} — ${p.primary_category} | Afrik Art`;
    const description = (p.bio || p.tagline || "").slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        ...(p.cover_url ? [{ property: "og:image", content: p.cover_url }] : []),
      ],
    };
  },
  component: PublicProfilePage,
});

const AVAILABILITY = {
  available: { label: "Disponible pour des projets", dot: "bg-primary" },
  open_to_collab: { label: "Ouvert aux collaborations", dot: "surface-teal" },
  busy: { label: "Agenda chargé", dot: "bg-foreground" },
};

function PublicProfilePage() {
  const { profile, artworks, boosted } = Route.useLoaderData();
  const { user, isAuthenticated } = useAuth();
  const isOwner = isAuthenticated && user?.id === profile.user_id;

  useEffect(() => {
    recordProfileView({ data: { profileId: profile.id } }).catch(() => {});
  }, [profile.id]);

  const photos = artworks.filter((a) => a.media_type !== "video");
  const videos = artworks.filter((a) => a.media_type === "video");
  const avail = AVAILABILITY[profile.availability] || AVAILABILITY.available;

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien du profil copié.");
    } catch {
      toast.error("Impossible de copier le lien.");
    }
  }

  return (
    <div>
      <div className="relative h-[280px] w-full overflow-hidden bg-secondary sm:h-[360px]">
        {profile.cover_url ? (
          <Image src={profile.cover_url} alt={`Couverture de ${profile.display_name}`} className="h-full w-full" />
        ) : (
          <div className="h-full w-full bg-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Link
          to="/explorer"
          className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3.5 py-2 text-[12px] font-medium backdrop-blur-sm lg:left-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Explorer
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-background bg-secondary sm:h-36 sm:w-36">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.display_name} className="h-full w-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-semibold text-primary">
                  {profile.display_name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-tight">
                  {profile.display_name}
                </h1>
                {profile.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                {profile.plan !== "starter" && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
                      profile.plan === "premium" ? "bg-accent text-foreground" : "bg-foreground text-background"
                    )}
                  >
                    {profile.plan === "premium" ? "Premium" : "Pro"}
                  </span>
                )}
                {boosted && (
                  <span className="rounded-full border border-accent/50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-accent">
                    Mis en avant
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={cn("h-1.5 w-1.5 rounded-full", avail.dot)} />
                  {avail.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={share}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-secondary"
            >
              <Share2 className="h-3.5 w-3.5" /> Partager
            </button>
            {isOwner ? (
              <Link
                to="/dashboard/visibilite"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-[12.5px] font-medium text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" /> Mettre en avant
              </Link>
            ) : (
              <ContactDialog profile={profile}>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background transition-colors hover:bg-primary">
                  Contacter cet artiste
                </button>
              </ContactDialog>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-12 pb-20 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div>
            <div className="flex flex-wrap gap-2">
              {[profile.primary_category, ...(profile.categories || []).filter((c) => c !== profile.primary_category)]
                .filter(Boolean)
                .map((c) => (
                  <Link
                    key={c}
                    to="/explorer"
                    search={{ category: c }}
                    className="rounded-full bg-secondary px-3 py-1.5 text-[11.5px] font-medium text-foreground/70 transition-colors hover:bg-secondary/70"
                  >
                    {c}
                  </Link>
                ))}
            </div>

            <div className="mt-8">
              <p className="label-caps">À propos</p>
              <p className="mt-3 whitespace-pre-line text-[14.5px] leading-relaxed text-foreground/80">
                {profile.bio || "Cet artiste n'a pas encore rédigé sa biographie."}
              </p>
            </div>

            {profile.specialty && (
              <div className="mt-6 rounded-xl border border-border bg-card px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Spécialité</p>
                <p className="mt-1.5 text-[13.5px]">{profile.specialty}</p>
              </div>
            )}

            <div className="mt-14">
              <div className="flex items-end justify-between">
                <div>
                  <p className="label-caps">Portfolio</p>
                  <h2 className="mt-2 text-xl font-medium">
                    {photos.length} œuvre{photos.length > 1 ? "s" : ""}
                  </h2>
                </div>
              </div>

              {photos.length === 0 ? (
                <p className="mt-5 rounded-xl border border-dashed border-border px-5 py-10 text-center text-[13px] text-muted-foreground">
                  Aucune œuvre publiée pour le moment.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {photos.map((a) => (
                    <figure key={a.id} className="group overflow-hidden rounded-xl border border-border bg-card">
                      <div className="aspect-[4/3] overflow-hidden bg-secondary">
                        {a.image_url ? (
                          <Image
                            src={a.image_url}
                            alt={a.title}
                            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[12px] text-muted-foreground">
                            Image indisponible
                          </div>
                        )}
                      </div>
                      <figcaption className="px-4 py-3.5">
                        <p className="text-[13.5px] font-medium">{a.title}</p>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          {[a.category, a.year].filter(Boolean).join(" · ")}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>

            {videos.length > 0 && (
              <div className="mt-14">
                <p className="label-caps">Vidéos & réalisations</p>
                <div className="mt-5 space-y-3">
                  {videos.map((v) => (
                    <a
                      key={v.id}
                      href={v.video_url || "#"}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/20"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Play className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium">{v.title}</span>
                        <span className="mt-0.5 block text-[11.5px] text-muted-foreground">
                          {v.description || "Ouvrir la vidéo"}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-14 border-t border-border pt-6">
              <ReportDialog profile={profile} />
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="label-caps">Contact professionnel</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                Envoyez une demande détaillée : projet, dates, budget. L'artiste reçoit
                votre message directement dans son espace.
              </p>
              {!isOwner && (
                <ContactDialog profile={profile}>
                  <button className="mt-5 w-full rounded-full bg-foreground px-5 py-3 text-[13px] font-medium text-background transition-colors hover:bg-primary">
                    Contacter cet artiste
                  </button>
                </ContactDialog>
              )}

              <div className="mt-6 space-y-3 border-t border-border pt-5">
                {profile.website && (
                  <a
                    href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-[13px] text-foreground/75 hover:text-foreground"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" /> Site internet
                    <Link2 className="ml-auto h-3 w-3 text-muted-foreground" />
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-[13px] text-foreground/75 hover:text-foreground"
                  >
                    <Instagram className="h-4 w-4 text-muted-foreground" /> @{profile.instagram.replace("@", "")}
                  </a>
                )}
                {profile.behance && (
                  <a
                    href={profile.behance.startsWith("http") ? profile.behance : `https://behance.net/${profile.behance}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-[13px] text-foreground/75 hover:text-foreground"
                  >
                    <Link2 className="h-4 w-4 text-muted-foreground" /> Behance
                  </a>
                )}
                {profile.youtube && (
                  <a
                    href={profile.youtube}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-[13px] text-foreground/75 hover:text-foreground"
                  >
                    <Play className="h-4 w-4 text-muted-foreground" /> YouTube
                  </a>
                )}
                {profile.created_date && (
                  <p className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Membre depuis{" "}
                    {new Date(profile.created_date).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}