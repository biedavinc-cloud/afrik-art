import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { Image } from "@/components/ui/image";
import { excerptOf, formatDate, readMinutes } from "@/lib/blog";

export default function BlogCard({ post, compact = false }) {
  return (
    <Link
      to="/actualites/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_20px_50px_-28px_rgba(21,21,21,0.4)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            quality={95}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary/10 text-[12px] font-medium uppercase tracking-[0.18em] text-primary">
            {post.category || "Journal"}
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground">
            {post.category || "Culture"}
          </span>
          {post.editorial && (
            <span className="rounded-full bg-foreground/90 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.14em] text-background">
              Rédaction
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className={
            compact
              ? "line-clamp-2 text-[14.5px] font-medium leading-snug"
              : "line-clamp-3 text-[16px] font-medium leading-snug"
          }
        >
          {post.title}
        </h3>
        {!compact && (
          <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-muted-foreground">
            {excerptOf(post, 150)}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {readMinutes(post)} min
            {post.published_at ? ` · ${formatDate(post.published_at)}` : ""}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-foreground/40 transition-colors group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}