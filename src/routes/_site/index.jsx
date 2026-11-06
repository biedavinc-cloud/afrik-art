import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import CategoryStrip from "@/components/home/CategoryStrip";
import ArtistRail from "@/components/home/ArtistRail";
import HowItWorks from "@/components/home/HowItWorks";
import MissionBlock from "@/components/home/MissionBlock";
import PlanCards from "@/components/PlanCards";
import { getHomeData } from "@/lib/server-fns";
import { demoCategories } from "@/lib/demoContent";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_site/")({
  loader: () => getHomeData(),
  head: () => ({
    meta: [
      { title: "Afrik Art — Le talent africain mérite une scène mondiale" },
      {
        name: "description",
        content:
          "Découvrez les artistes, photographes, musiciens et créateurs africains. Créez votre portfolio professionnel gratuitement sur la plateforme panafricaine des talents.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { featured, sponsored, recent, categories, countries, plans, totalArtists } =
    Route.useLoaderData();
  const { t } = useI18n();

  const displayCategories = categories.length ? categories : demoCategories;
  const featuredList = featured.filter((a) => a.boosted).concat(featured.filter((a) => !a.boosted));

  return (
    <>
      <HeroSection />

      <CategoryStrip categories={displayCategories} />

      {featuredList.length > 0 && (
        <ArtistRail
          eyebrow={t("home.feat.eyebrow")}
          title={t("home.feat.title")}
          subtitle={t("home.feat.text")}
          artists={featuredList.slice(0, 4)}
          linkTo="/explorer"
          linkLabel={t("home.feat.link", { n: totalArtists })}
        />
      )}

      <HowItWorks />

      {recent.length > 0 && (
        <ArtistRail
          eyebrow={t("home.recent.eyebrow")}
          title={t("home.recent.title")}
          subtitle={t("home.recent.text")}
          artists={recent}
          linkTo="/explorer"
          linkLabel={t("home.recent.link")}
        />
      )}

      {countries.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div>
            <p className="label-caps">{t("home.geo.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight">
              {t("home.geo.title")}
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {countries.slice(0, 8).map((c) => (
              <Link
                key={c.name}
                to="/explorer"
                search={{ country: c.name }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card px-5 py-6 transition-colors hover:border-primary/40"
              >
                <p className="text-[14px] font-medium">{c.name}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {c.count > 1
                    ? t("home.geo.countPlural", { n: c.count })
                    : t("home.geo.count", { n: c.count })}
                </p>
                <ArrowRight className="absolute right-4 top-5 h-4 w-4 -translate-x-2 text-accent opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <MissionBlock />

      <section className="bg-secondary/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-caps">{t("home.plans.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-semibold leading-tight">
              {t("home.plans.title")}
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              {t("home.plans.text")}
            </p>
          </div>
          <div className="mt-12">
            <PlanCards plans={plans.length ? plans : undefined} compact />
          </div>
          <p className="mt-8 text-center text-[12px] text-muted-foreground">
            {t("home.plans.note")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-foreground px-7 py-14 text-background lg:px-16 lg:py-20">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-background/15" />
          <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full border border-background/10" />
          <div className="relative max-w-xl">
            <h2 className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight">
              {t("home.cta.title")}
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-background/70">
              {t("home.cta.text")}
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("home.cta.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}