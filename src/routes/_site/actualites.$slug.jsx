import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ArticleBody from "@/components/blog/ArticleBody";
import BlogCard from "@/components/blog/BlogCard";
import ShareBar from "@/components/blog/ShareBar";
import { Image } from "@/components/ui/image";
import { getBlogPost } from "@/lib/content-fns";
import { formatDate, readMinutes } from "@/lib/blog";

export const Route = createFileRoute("/_site/actualites/$slug")({
  loader: async ({ params }) => {
    const data = await getBlogPost({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article | Afrik Art" }] };
    const description = (post.excerpt || post.content || "").slice(0, 155);
    return {
      meta: [
        { title: `${post.title} | Afrik Art` },
        { name: "description", content: description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.cover_url
          ? [
              { property: "og:image", content: post.cover_url },
              { name: "twitter:image", content: post.cover_url },
            ]
          : []),
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { post, related } = Route.useLoaderData();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.cover_url || undefined,
    datePublished: post.published_at || post.created_date,
    dateModified: post.updated_date || post.published_at || post.created_date,
    author: { "@type": "Person", name: post.author_name || "Afrik Art" },
    publisher: { "@type": "Organization", name: "Afrik Art" },
    inLanguage: "fr",
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="relative overflow-hidden bg-foreground">
        {post.cover_url ? (
          <div className="absolute inset-0">
            <Image
              src={post.cover_url}
              alt={post.title}
              quality={95}
              className="h-full w-full opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(227,29,43,0.45),transparent_65%)]" />
        )}

        <div className="relative mx-auto flex min-h-[420px] max-w-4xl flex-col justify-end px-5 pb-12 pt-24 lg:min-h-[520px] lg:px-8 lg:pb-16">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
              {post.category || "Culture"}
            </span>
            {post.editorial && (
              <span className="rounded-full border border-white/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/90">
                Rédaction Afrik Art
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-heading text-[clamp(1.9rem,4.4vw,3.1rem)] font-semibold leading-[1.1] tracking-tight text-white">
            {post.title}
          </h1>

          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-white/70">
            Par <span className="font-medium text-white">{post.author_name}</span>
            {post.published_at && (
              <>
                <span className="text-white/40">·</span>
                <span>{formatDate(post.published_at)}</span>
              </>
            )}
            <span className="text-white/40">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {readMinutes(post)} min de lecture
            </span>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-16 pt-8 lg:px-8">
        <Link
          to="/actualites"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Toutes les actualités
        </Link>

        {post.excerpt && (
          <p className="mt-8 border-l-2 border-accent pl-5 text-[18px] leading-[1.65] text-foreground/75">
            {post.excerpt}
          </p>
        )}

        <div className="mt-10">
          <ArticleBody content={post.content} />
        </div>

        <div className="mt-12">
          <ShareBar title={post.title} />
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-medium">{post.author_name}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              Journal Afrik Art — récits, méthodes et analyses de la création africaine.
            </p>
          </div>
          <Link
            to="/actualites"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-medium text-background transition-colors hover:bg-primary"
          >
            Lire d'autres articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-border px-6 py-5 sm:flex-row sm:items-center">
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            Vous êtes artiste ? Publiez votre portfolio et vendez vos œuvres.
          </p>
          <Link
            to="/register"
            className="shrink-0 rounded-full border border-foreground/20 px-4 py-2 text-[12px] font-medium hover:border-foreground/40"
          >
            Créer mon profil
          </Link>
        </div>
      </div>

      {related?.length > 0 && (
        <div className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-caps">À lire aussi</p>
                <h2 className="mt-2 text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold">
                  Poursuivre la lecture
                </h2>
              </div>
              <Link
                to="/actualites"
                className="hidden shrink-0 items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
              >
                Tout le journal <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <BlogCard key={r.id} post={r} compact />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}