import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import ArtistCard from "@/components/ArtistCard";

export default function ArtistRail({ eyebrow, title, subtitle, artists, linkTo, linkLabel }) {
  if (!artists?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="label-caps">{eyebrow}</p>
          <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            {linkLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {artists.slice(0, 4).map((a) => (
          <ArtistCard key={a.id || a.slug} artist={a} sponsored={a.boosted} />
        ))}
      </div>
    </section>
  );
}