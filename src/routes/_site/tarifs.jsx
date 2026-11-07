import { createFileRoute, Link } from "@tanstack/react-router";
import PlanCards from "@/components/PlanCards";
import { BOOST_PACKAGES, DEFAULT_PLANS, localizedPlan } from "@/lib/plans";
import { getPublicPlans } from "@/lib/server-fns";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_site/tarifs")({
  loader: async () => {
    const plans = await getPublicPlans();
    return { plans: plans.length ? plans : DEFAULT_PLANS };
  },
  head: () => ({
    meta: [
      { title: "Abonnements et tarifs | Afrik Art" },
      {
        name: "description",
        content:
          "Starter gratuit, Pro à 9 $/mois, Premium à 29 $/mois. Mises en avant à partir de 2 $ pour gagner en visibilité.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { plans } = Route.useLoaderData();
  const { lang, t } = useI18n();

  const faq = [1, 2, 3, 4, 5].map((i) => ({
    q: t(`pricing.faq${i}q`),
    a: t(`pricing.faq${i}a`),
  }));

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pb-8 pt-14 text-center lg:px-8 lg:pt-20">
        <p className="label-caps">{t("pricing.eyebrow")}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-[clamp(2rem,4.8vw,3.4rem)] font-semibold leading-tight">
          {t("pricing.title")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
          {t("pricing.text")}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <PlanCards plans={plans} />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-7 lg:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="label-caps">{t("pricing.boost.eyebrow")}</p>
              <h2 className="mt-2 text-xl font-medium">{t("pricing.boost.title")}</h2>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
                {t("pricing.boost.text")}
              </p>
            </div>
            <Link
              to="/dashboard/visibilite"
              className="rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
            >
              {t("pricing.boost.cta")}
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            {BOOST_PACKAGES.map((b) => {
              const localized = lang === "en" ? b.label_en || b.label : b.label;
              return (
                <div key={b.hours} className="rounded-xl border border-border px-5 py-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {localized}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{b.price} $</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
        <h2 className="text-center text-[clamp(1.6rem,3vw,2.2rem)] font-semibold">
          {t("pricing.faq")}
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium">
                {f.q}
                <span className="text-accent transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}