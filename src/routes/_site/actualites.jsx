import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2, PenLine, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import { listBlogPosts } from "@/lib/content-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/actualites")({
  validateSearch: (s) => ({
    q: s.q || undefined,
    category: s.category || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listBlogPosts({ data: deps }),
  head: () => ({
    meta: [
      { title: "Actualités culturelles africaines | Afrik Art" },
      {
        name: "description",
        content:
          "Tendances, portraits et analyses sur la création africaine contemporaine, écrits par les artistes de la plateforme.",
      },
    ],
  }),
  component: NewsPage,
});

function excerpt(post) {
  return post.excerpt || (post.content || "").slice(0, 160);
}

function readMinutes(post) {
  return Math.max(2, Math.round(((post.content || "").split(/\s+/).length || 0) / 220));
}

function NewsPage() {
  const data = Route.useLoaderData();
  const { categories } = data;
  const search = Route.useSearch();
  const navigate = useNavigate();
  const fetchMore = useServerFn(listBlogPosts);
  const [extra, setExtra] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setExtra([]);
  }, [data]);

  const items = [...data.items, ...extra];
  const [featured, ...rest] = items;
  const hasMore = items.length < (data.total || 0);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetchMore({
        data: { q: search.q, category: search.category, offset: items.length },
      });
      setExtra((prev) => [...prev, ...res.items]);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="label-caps">Journal</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight">
            Actualités culturelles
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
            Les tendances, les débats et les récits qui traversent la création africaine —
            racontés par celles et ceux qui la font vivre.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            navigate({ to: "/actualites", search: { q: q || undefined, category: search.category } });
          }}
          className="flex w-full gap-2 sm:w-auto"
        >
          <Input name="q" defaultValue={search.q || ""} placeholder="Rechercher un article" className="h-11 w-full rounded-full sm:w-64" />
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[12.5px] font-medium text-background">
            <Search className="h-3.5 w-3.5" /> Chercher
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => navigate({ to: "/actualites", search: { q: search.q } })}
          className={cn(
            "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
            !search.category ? "bg-foreground text-background" : "border border-border text-foreground/70"
          )}
        >
          Tous les sujets
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => navigate({ to: "/actualites", search: { q: search.q, category: c } })}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
              search.category === c ? "bg-foreground text-background" : "border border-border text-foreground/70"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <PenLine className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-[15px] font-medium">Aucun article pour le moment.</p>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Les artistes publient leurs récits depuis leur espace personnel.
          </p>
          <Link
            to="/dashboard/blog"
            className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
          >
            Écrire le premier article
          </Link>
        </div>
      ) : (
        <>
          <Link
            to="/actualites/$slug"
            params={{ slug: featured.slug }}
            className="group mt-10 grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden bg-secondary lg:aspect-auto">
              {featured.cover_url ? (
                <Image
                  src={featured.cover_url}
                  alt={featured.title}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center bg-primary/10 text-[13px] text-primary">
                  Afrik Art
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-7 lg:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {featured.category || "Culture"} ·{" "}
                {featured.editorial ? "Rédaction" : "À la une"}
              </p>
              <h2 className="mt-4 text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-snug">
                {featured.title}
              </h2>
              <p className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground">
                {excerpt(featured)}
              </p>
              <p className="mt-6 flex items-center gap-2 text-[12px] text-muted-foreground">
                Par {featured.author_name}
                <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </div>
          </Link>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.id}
                to="/actualites/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/20"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  {post.cover_url ? (
                    <Image src={post.cover_url} alt={post.title} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/10 text-[12px] text-primary">
                      {post.category || "Culture"}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {post.category || "Culture"}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-[15.5px] font-medium leading-snug">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {excerpt(post)}
                  </p>
                  <p className="mt-auto flex items-center gap-2 pt-4 text-[11.5px] text-muted-foreground">
                    <span>{post.author_name}</span>
                    <span className="text-border">·</span>
                    <span>{readMinutes(post)} min</span>
                    {post.editorial && (
                      <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-background">
                        Rédaction
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-[12px] text-muted-foreground">
                {items.length} sur {data.total} articles
              </p>
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-secondary disabled:opacity-60"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Charger plus d'articles
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}