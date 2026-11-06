import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import ArtisticBackdrop from "@/components/art/ArtisticBackdrop";
import { useI18n } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative isolate overflow-hidden bg-foreground">
      <Image
        src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=2000&q=85"
        alt="Portrait d'un créateur africain dans une lumière chaude"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      <ArtisticBackdrop variant="dark" />

      <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:px-8 lg:pb-24">
        <div className="max-w-3xl fade-up">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
              {t("home.hero.eyebrow")}
            </span>
          </div>

          <h1 className="mt-7 text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[1.03] text-white">
            {t("home.hero.t1")}
            <br />
            {t("home.hero.t2")}{" "}
            <span className="italic text-accent">{t("home.hero.accent")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
            {t("home.hero.text")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/explorer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-3.5 text-[13.5px] font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("home.hero.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-[13.5px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              {t("home.hero.cta2")}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-7">
          {[
            { k: "15", v: t("home.hero.s1") },
            { k: "54", v: t("home.hero.s2") },
            { k: "0 $", v: t("home.hero.s3") },
          ].map((s) => (
            <div key={s.v}>
              <p className="text-xl font-semibold text-white sm:text-2xl">{s.k}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}