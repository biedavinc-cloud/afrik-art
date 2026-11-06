import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
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

function Blocks({ content }) {
  const lines = (content || "").split("\n");
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const text = line.trim();
        if (!text) return null;
        if (text.startsWith("## "))
          return (
            <h2 key={i} className="pt-6 text-[22px] font-semibold">
              {text.replace("## ", "")}
            </h2>
          );
        if (text.startsWith("- "))
          return (
            <p key={i} className="pl-4 text-[15px] leading-relaxed text-foreground/80">
              • {text.replace("- ", "")}
            </p>
          );
        return (
          <p key={i} className="text-[15.5px] leading-[1.75] text-foreground/80">
            {text}
          </p>
        );
      })}
    </div>
  );
}

function ArticlePage() {
  const { post, related } = Route.useLoaderData();

  return (
    <article>
      {post.cover_url && (
        <div className="h-[280px] w-full overflow-hidden bg-secondary sm:h-[420px]">
          <Image src={post.cover_url} alt={post.title} className="h-full w-full" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
        <Link
          to="/actualites"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Toutes les actualités
        </Link>

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
          {post.category || "Culture"}
        </p>
        <h1 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-semibold leading-tight">{post.title}</h1>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted-foreground">
          Par{" "}
          {post.author_slug ? (
            <Link to="/talents/$slug" params={{ slug: post.author_slug }} className="font-medium text-foreground hover:text-primary">
              {post.author_name}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{post.author_name}</span>
          )}
          {post.published_at && (
            <>
              ·{" "}
              {new Date(post.published_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          )}
        </p>

        {post.excerpt && (
          <p className="mt-8 border-l-2 border-accent pl-5 text-[16px] leading-relaxed text-foreground/70">
            {post.excerpt}
          </p>
        )}

        <div className="mt-9">
          <Blocks content={post.content} />
        </div>

        {related?.length > 0 && (
          <div className="mt-16 border-t border-border pt-8">
            <p className="label-caps">À lire aussi</p>
            <div className="mt-5 space-y-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/actualites/$slug"
                  params={{ slug: r.slug }}
                  className="block rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-foreground/20"
                >
                  <p className="text-[13.5px] font-medium">{r.title}</p>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">{r.author_name}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}