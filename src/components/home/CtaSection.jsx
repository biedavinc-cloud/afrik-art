import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import ArtisticBackdrop from "@/components/art/ArtisticBackdrop";

// Section d'appel à l'action : ample, éditoriale, avec une couche animée.
export default function CtaSection() {
  const { t } = useI18n();

  const figures = [
    { k: "15", v: t("home.hero.s2") },
    { k: "54", v: t("home.hero.s1") },
    { k: "0 $", v: t("home.hero.s3") },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-foreground text-background">
      <ArtisticBackdrop variant="dark" />
      <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-background/50">
                Afrik Art
              </span>
            </div>

            <h2 className="mt-8 max-w-2xl font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.06] tracking-tight">
              {t("home.cta.title")}
            </h2>

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-background/65 sm:text-[16px]">
              {t("home.cta.text")}
            </p>

            <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("home.cta.button")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center rounded-full border border-background/25 px-8 py-4 text-[13.5px] font-medium text-background transition-colors hover:bg-background/10"
              >
                {t("mission.cta")}
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl border border-background/15 bg-background/[0.06] p-8 backdrop-blur-sm lg:p-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-background/45">
              {t("home.plans.eyebrow")}
            </p>
            <div className="mt-7 space-y-7">
              {figures.map((f) => (
                <div key={f.v} className="flex items-baseline gap-4 border-b border-background/10 pb-6 last:border-0 last:pb-0">
                  <p className="font-heading text-[clamp(1.6rem,2.4vw,2.1rem)] font-semibold leading-none text-background">
                    {f.k}
                  </p>
                  <p className="text-[11.5px] uppercase tracking-[0.16em] text-background/50">
                    {f.v}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-[12px] leading-relaxed text-background/45">
              {t("home.plans.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}