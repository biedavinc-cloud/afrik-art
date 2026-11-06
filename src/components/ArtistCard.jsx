import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PLAN_STYLES = {
  pro: "bg-foreground text-background",
  premium: "bg-accent text-foreground",
};

export default function ArtistCard({ artist, sponsored = false }) {
  const { t } = useI18n();
  const image = artist.cover_url || artist.avatar_url;

  return (
    <Link
      to="/talents/$slug"
      params={{ slug: artist.slug }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_-24px_rgba(21,21,21,0.35)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image}
            alt={artist.display_name}
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary">
            {artist.display_name?.charAt(0) || "A"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />

        <div className="absolute left-3 top-3 flex gap-2">
          {sponsored && (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground">
              {t("artist.sponsored")}
            </span>
          )}
        </div>

        {artist.plan && artist.plan !== "starter" && (
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]",
              PLAN_STYLES[artist.plan] || "bg-background text-foreground"
            )}
          >
            {artist.plan === "pro" ? "Pro" : "Premium"}
          </span>
        )}

        <div className="absolute inset-x-4 bottom-4">
          <p className="text-[15px] font-medium text-white">{artist.display_name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/70">
            <MapPin className="h-3 w-3" strokeWidth={1.8} />
            {[artist.city, artist.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
          {artist.primary_category}
        </p>
        {artist.tagline && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {artist.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}