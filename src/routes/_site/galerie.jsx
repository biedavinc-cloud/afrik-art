import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageOff, Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listGallery } from "@/lib/content-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/galerie")({
  validateSearch: (s) => ({
    q: s.q || undefined,
    category: s.category || undefined,
    media: s.media || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    listGallery({
      data: {
        q: deps.q,
        category: deps.category,
        media: ["photo", "video"].includes(deps.media) ? deps.media : "all",
      },
    }),
  head: () => ({
    meta: [
      { title: "Galerie publique | Afrik Art" },
      {
        name: "description",
        content:
          "Découvrez librement les œuvres des artistes africains : photographie, peinture, illustration, vidéo. Aucun compte requis.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { items, total, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(search.q || "");

  useEffect(() => setQ(search.q || ""), [search.q]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="label-caps">Galerie publique</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.1rem)] font-semibold leading-tight">
            L'art africain, sans inscription
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
            {total > 1 ? `${total} œuvres` : `${total} œuvre`} publiées par les créateurs de la
            plateforme. Cliquez sur une œuvre pour découvrir l'artiste.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/galerie", search: { ...search, q: q || undefined } });
          }}
          className="flex w-full gap-2 sm:w-auto"
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Titre, artiste, pays"
            className="h-11 w-full rounded-full sm:w-64"
          />
          <button className="h-11 rounded-full bg-foreground px-5 text-[12.5px] font-medium text-background">
            Chercher
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => navigate({ to: "/galerie", search: { ...search, category: undefined } })}
          className={cn(
            "rounded-full px-4 py-1.5 text-[12px] font-medium",
            !search.category ? "bg-foreground text-background" : "border border-border text-foreground/70"
          )}
        >
          Toutes les disciplines
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => navigate({ to: "/galerie", search: { ...search, category: c } })}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium",
              search.category === c ? "bg-foreground text-background" : "border border-border text-foreground/70"
            )}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto">
          <Select
            value={search.media || "all"}
            onValueChange={(v) =>
              navigate({ to: "/galerie", search: { ...search, media: v === "all" ? undefined : v } })
            }
          >
            <SelectTrigger className="h-9 w-36 rounded-full text-[12px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout médium</SelectItem>
              <SelectItem value="photo">Photographies</SelectItem>
              <SelectItem value="video">Vidéos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <ImageOff className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-[15px] font-medium">Aucune œuvre ne correspond.</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Essayez une autre discipline ou effacez la recherche.
          </p>
        </div>
      ) : (
        <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {items.map((art) => (
            <Link
              key={art.id}
              to="/talents/$slug"
              params={{ slug: art.artist_slug }}
              className="group mb-4 block break-inside-avoid overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative overflow-hidden bg-secondary">
                {art.media_type === "video" ? (
                  <div className="flex aspect-[4/3] items-center justify-center bg-foreground/90 text-background">
                    <Play className="h-7 w-7" />
                  </div>
                ) : art.image_url ? (
                  <Image
                    src={art.image_url}
                    alt={art.title}
                    className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-[12px] text-muted-foreground">
                    Image indisponible
                  </div>
                )}
              </div>
              <div className="px-3.5 py-3">
                <p className="truncate text-[13px] font-medium">{art.title}</p>
                <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                  {art.artist_name}
                  {art.artist_country ? ` · ${art.artist_country}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}