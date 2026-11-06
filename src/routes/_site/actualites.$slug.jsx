import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getBlogPost } from "@/lib/content-fns";

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
        ...(post.cover_url ? [{ property: "og:image", content: post.cover_url }] : []),
      ],
    };
  },
  component: ArticlePage,
});

const readTime = (post) =>
  Math.max(2, Math.round(((post.content || "").split(/\s+/).length || 0) / 220));

function Blocks({ content }) {
  const lines = (content || "").split("\n");
  const blocks = [];
  let list = null;

  lines.forEach((line) => {
    const text = line.trim();
    if (!text) {
      list = null;
      return;
    }
    if (text.startsWith("- ")) {
      if (!list) {
        list = [];
        blocks.push({ type: "list", items: list });
      }
      list.push(text.slice(2));
      return;
    }
    list = null;
    if (text.startsWith("## ")) blocks.push({ type: "h2", text: text.slice(3) });
    else blocks.push({ type: "p", text });
  });

  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === "h2")
          return (
            <div key={i} className="mt-12 first:mt-0">
              <span className="rule-gold block" />
              <h2 className="mt-4 font-heading text-[clamp(1.2rem,2vw,1.45rem)] font-semibold leading-snug tracking-tight">
                {b.text}
              </h2>
            </div>
          );
        if (b.type === "list")
          return (
            <ul key={i} className="mt-5 space-y-2.5">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-[1.7] text-foreground/80">
                  <span className="mt-[10px] h-1 w-4 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="mt-5 text-[16px] leading-[1.8] text-foreground/80">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function ArticlePage() {
  const { post, related } = Route.useLoaderData();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.cover_url || undefined,
    datePublished: post.published_at || post.created_date,
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

      {post.cover_url ? (
        <div className="relative h-[300px] w-full overflow-hidden bg-foreground sm:h-[460px]">
          <Image src={post.cover_url} alt={post.title} className="h-full w-full opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>
      ) : (
        <div className="relative h-[200px] w-full overflow-hidden bg-foreground sm:h-[260px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(227,29,43,0.45),transparent_60%)]" />
          <div className="absolute inset-0 flex items-end px-5 pb-6 lg:px-8">
            <span className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-background/60">
              {post.category || "Journal Afrik Art"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
        <Link
          to="/actualites"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Toutes les actualités
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-primary">
            {post.category || "Culture"}
          </span>
          {post.editorial && (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-background">
              Rédaction
            </span>
          )}
        </div>

        <h1 className="mt-4 font-heading text-[clamp(1.9rem,4vw,2.9rem)] font-semibold leading-[1.12] tracking-tight">
          {post.title}
        </h1>

        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-5 text-[12.5px] text-muted-foreground">
          Par{" "}
          {post.author_slug ? (
            <Link
              to="/talents/$slug"
              params={{ slug: post.author_slug }}
              className="font-medium text-foreground hover:text-primary"
            >
              {post.author_name}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{post.author_name}</span>
          )}
          {post.published_at && (
            <>
              <span className="text-border">·</span>
              {new Date(post.published_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </>
          )}
          <span className="text-border">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readTime(post)} min de lecture
          </span>
        </p>

        {post.excerpt && (
          <p className="mt-9 border-l-2 border-accent pl-5 text-[17px] leading-[1.7] text-foreground/70">
            {post.excerpt}
          </p>
        )}

        <div className="mt-10">
          <Blocks content={post.content} />
        </div>

        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-medium">{post.author_name}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Journal Afrik Art — récits et analyses de la création africaine.
            </p>
          </div>
          <Link
            to="/actualites"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-[12px] font-medium text-background transition-colors hover:bg-primary"
          >
            Lire d'autres articles
          </Link>
        </div>

        {related?.length > 0 && (
          <div className="mt-14 border-t border-border pt-9">
            <p className="label-caps">À lire aussi</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/actualites/$slug"
                  params={{ slug: r.slug }}
                  className="group flex gap-3 overflow-hidden rounded-xl border border-border bg-card p-3 transition-colors hover:border-foreground/25"
                >
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {r.cover_url && (
                      <Image
                        src={r.cover_url}
                        alt={r.title}
                        className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-[13px] font-medium leading-snug">{r.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{r.author_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}