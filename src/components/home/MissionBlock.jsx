import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { useI18n } from "@/lib/i18n";

export default function MissionBlock() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80"
              alt="Détail d'une œuvre peinte aux tons chauds"
              className="aspect-[4/5] w-full"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden w-44 rounded-xl bg-primary p-5 text-primary-foreground sm:block lg:-right-8">
            <p className="text-[11px] uppercase tracking-[0.16em] text-primary-foreground/60">
              {t("mission.since")}
            </p>
            <p className="mt-2 text-[13px] leading-snug">{t("mission.badge")}</p>
          </div>
        </div>

        <div>
          <p className="label-caps">{t("mission.eyebrow")}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[1.15]">
            {t("mission.title")}
          </h2>
          <p className="mt-6 text-[14.5px] leading-relaxed text-muted-foreground">
            {t("mission.p1")}
          </p>
          <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
            {t("mission.p2")}
          </p>

          <div className="mt-9 grid grid-cols-2 gap-6 border-t border-border pt-8">
            <div>
              <p className="text-[13px] font-medium">{t("mission.r1t")}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {t("mission.r1x")}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium">{t("mission.r2t")}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {t("mission.r2x")}
              </p>
            </div>
          </div>

          <Link
            to="/categories"
            className="mt-8 inline-flex text-[13px] font-medium text-primary underline decoration-accent decoration-2 underline-offset-4"
          >
            {t("mission.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}