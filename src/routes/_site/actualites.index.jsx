import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Clock, Loader2, PenLine, Search } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Image } from "@/components/ui/image";
import { listBlogPosts } from "@/lib/content-fns";
import { excerptOf, formatDate, readMinutes } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/actualites/")({
  validateSearch: (s) => ({
    q: s.q || undefined,
    category: s.category || undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listBlogPosts({ data: deps }),
  head: () => ({
    meta: [
      { title: "Journal — cultures et marchés de l'art africain | Afrik Art" },
      {
        name: "description",
        content:
          "Analyses, reportages et conseils sur la création africaine contemporaine : marché de l'art, vente en ligne, portfolio, photographie et écosystème Liafrik.",
      },
    ],
  }),
  component: NewsPage,
});

function HeroStory({ post }) {
  return (
    <Link
      to="/actualites/$slug"
      params={{ slug: post.slug }}
      className="group relative block overflow-hidden rounded-2xl bg-foreground"
    >
      <div className="aspect-[16/11] w-full overflow-hidden lg:aspect-[16/12]">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            quality={95}
            className="h-full w-full opacity-95 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(227,29,43,0.5),transparent_65%)]" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
            {post.category || "Culture"}
          </span>
          {post.editorial && (
            <span className="rounded-full border border-white/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
              Rédaction
            </span>
          )}
        </div>
        <h2 className="mt-4 max-w-2xl font-heading text-[clamp(1.45rem,2.7vw,2.15rem)] font-semibold leading-[1.15] tracking-tight text-white">
          {post.title}
        </h2>
        <p className="mt-3 hidden max-w-xl text-[13.5px] leading-relaxed text-white/75 sm:block">
          {excerptOf(post, 150)}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-[11.5px] text-white/70">
          <span className="font-medium text-white">{post.author_name}</span>
          {post.published_at && <span className="text-white/40">·</span>}
          {post.published_at && <span>{formatDate(post.published_at)}</span>}
          <span className="text-white/40">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readMinutes(post)} min
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}

function SideStory({ post }) {
  return (
    <Link
      to="/actualites/$slug"
      params={{ slug: post.slug }}
      className="group flex gap-3 overflow-hidden rounded-xl border border-border bg-card p-3 transition-colors hover:border-foreground/25"
    >
      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            quality={95}
            className="h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary/10 text-[10px] uppercase tracking-[0.14em] text-primary">
            {post.category || "Journal"}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
          {post.category || "Culture"}
        </p>
        <p className="mt-1.5 line-clamp-3 text-[13.5px] font-medium leading-snug">{post.title}</p>
        <p className="mt-2 text-[11px] text-muted-foreground">{readMinutes(post)} min de lecture</p>
      </div>
    </Link>
  );
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
  const [featured, ...others] = items;
  const spotlight = others.slice(0, 2);
  const rest = others.slice(2);
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
          <p className="label-caps">Journal Afrik Art</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight">
            Comprendre la création africaine
          </h1>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
            Marchés, métiers, techniques et écosystème : des textes utiles pour celles et ceux qui
            vivent de leur art — et pour ceux qui veulent le découvrir.
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
          <Input
            name="q"
            defaultValue={search.q || ""}
            placeholder="Rechercher un article"
            className="h-11 w-full rounded-full sm:w-64"
          />
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
              search.category === c
                ? "bg-foreground text-background"
                : "border border-border text-foreground/70 hover:border-foreground/30"
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
            to="/blog"
            className="mt-6 inline-block rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
          >
            Écrire le premier article
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
            <HeroStory post={featured} />
            <div className="flex flex-col gap-4">
              {spotlight.map((post) => (
                <SideStory key={post.id} post={post} />
              ))}
              <div className="hidden flex-1 flex-col justify-between rounded-xl border border-border bg-secondary/50 p-5 lg:flex">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Le journal
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  Un article par semaine sur les métiers de la création : prix, portfolio, vente en
                  ligne, photographie et outils numériques.
                </p>
                <Link
                  to="/blog"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground hover:text-primary"
                >
                  Proposer un article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {rest.length > 0 && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

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