import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Eye, Medal, MapPin, Trophy } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getTopArtists } from "@/lib/content-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/top-artistes")({
  validateSearch: (s) => ({ sort: s.sort || undefined }),
  loaderDeps: ({ search }) => ({ sort: search.sort }),
  loader: ({ deps }) => getTopArtists({ data: { sort: deps.sort } }),
  head: () => ({
    meta: [
      { title: "Top artistes | Afrik Art" },
      {
        name: "description",
        content:
          "Le classement des artistes africains les plus consultés et les plus complets de la plateforme.",
      },
    ],
  }),
  component: TopArtistsPage,
});

const SORTS = [
  { value: "views", label: "Les plus consultés" },
  { value: "complete", label: "Profils les plus complets" },
  { value: "recent", label: "Nouveaux talents" },
];

function TopArtistsPage() {
  const { items, total } = Route.useLoaderData();
  const search = Route.useSearch();
  const active = search.sort || "views";
  const [first, second, third, ...rest] = items;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">Classement</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
          Top artistes
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          {total} profils publics. Le classement évolue en continu selon les visites, la
          complétude des profils et l'activité récente.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {SORTS.map((s) => (
          <Link
            key={s.value}
            to="/top-artistes"
            search={{ sort: s.value === "views" ? undefined : s.value }}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium",
              active === s.value
                ? "bg-foreground text-background"
                : "border border-border text-foreground/70"
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <Trophy className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-[15px] font-medium">Le classement se prépare.</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Les profils apparaîtront dès les premières visites.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[second, first, third].filter(Boolean).map((a) => (
              <Link
                key={a.id}
                to="/talents/$slug"
                params={{ slug: a.slug }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-5 text-center transition-all",
                  a.rank === 1
                    ? "border-accent bg-accent/5 sm:-mt-4 sm:pb-7"
                    : "border-border bg-card"
                )}
              >
                <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
                  {a.rank}
                </span>
                <div className="mx-auto mt-3 h-20 w-20 overflow-hidden rounded-full border border-border bg-secondary">
                  {a.avatar_url ? (
                    <Image src={a.avatar_url} alt={a.display_name} className="h-full w-full" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                      {a.display_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[14.5px] font-medium">
                  {a.display_name}
                  {a.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                </p>
                <p className="mt-1 text-[11.5px] text-muted-foreground">
                  {[a.city, a.country].filter(Boolean).join(", ") || a.primary_category}
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px]">
                  <Eye className="h-3 w-3" /> {a.views || 0} visites
                </p>
              </Link>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {rest.map((a) => (
                <Link
                  key={a.id}
                  to="/talents/$slug"
                  params={{ slug: a.slug }}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/60"
                >
                  <span className="w-6 text-[12px] font-medium text-muted-foreground">{a.rank}</span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                    {a.avatar_url ? (
                      <Image src={a.avatar_url} alt={a.display_name} className="h-full w-full" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-primary">
                        {a.display_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{a.display_name}</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">
                      {a.primary_category}
                      {a.country ? ` · ${a.country}` : ""}
                    </p>
                  </div>
                  <span className="hidden items-center gap-1.5 text-[11.5px] text-muted-foreground sm:flex">
                    <Eye className="h-3 w-3" /> {a.views || 0}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-6 flex items-center gap-2 text-[11.5px] text-muted-foreground">
            <Medal className="h-3.5 w-3.5" /> Les profils mis en avant sont signalés comme
            sponsorisés dans les résultats de recherche.
          </p>
        </>
      )}
    </div>
  );
}