import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ArtMarketBand, ProductLogo } from "@/components/home/EcosystemBlock";
import { useI18n } from "@/lib/i18n";
import { GROUPS, LIAFRIK, MORE_PRODUCTS, PRODUCTS, pick } from "@/lib/ecosystem";

const SITE = "https://afrik.cloud";

const COPY = {
  fr: {
    title: "Écosystème Liafrik : des logiciels conçus depuis l'Afrique | Afrik Art",
    description:
      "Zanldo, Sukulu, Health, Stella, POS Flow, Sellia, Nutro, Atlas CRM, LiBooks : découvrez l'écosystème de logiciels Liafrik, conçu depuis l'Afrique pour toute l'Afrique.",
    kicker: "Écosystème Liafrik",
    h1: "Des logiciels nés en Afrique, pour faire tourner le continent.",
    lead: "Afrik Art est un produit de Liafrik, un écosystème de logiciels qui équipe le commerce, l'école, l'hôpital, le salon, le restaurant et la comptabilité. Racines africaines, vision mondiale.",
    visit: "Visiter liafrik.com",
    catalog: "Voir les 20 produits",
    discover: "Découvrir",
    sheet: "Fiche produit",
    more: "Et aussi dans le catalogue",
    moreText: "Liafrik compte vingt produits. Voici les autres, avec leur fiche officielle.",
    ctaTitle: "Vous créez ? Commencez par vous montrer.",
    ctaText: "Ouvrez votre profil Afrik Art gratuitement et partagez votre portfolio d'un simple lien.",
    ctaButton: "Créer mon profil",
  },
  en: {
    title: "Liafrik ecosystem: software designed from Africa | Afrik Art",
    description:
      "Zanldo, Sukulu, Health, Stella, POS Flow, Sellia, Nutro, Atlas CRM, LiBooks: discover Liafrik, the software ecosystem designed from Africa for all of Africa.",
    kicker: "Liafrik ecosystem",
    h1: "Software born in Africa, to keep the continent running.",
    lead: "Afrik Art is a Liafrik product. Liafrik is an ecosystem of software equipping commerce, schools, hospitals, salons, restaurants and accounting. African roots, global vision.",
    visit: "Visit liafrik.com",
    catalog: "See all 20 products",
    discover: "Discover",
    sheet: "Product page",
    more: "Also in the catalog",
    moreText: "Liafrik has twenty products. Here are the others, with their official pages.",
    ctaTitle: "Creating? Start by being seen.",
    ctaText: "Open your Afrik Art profile for free and share your portfolio with a single link.",
    ctaButton: "Create my profile",
  },
};

const abs = (path) => (path ? SITE + path : undefined);

function structuredData(L) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: LIAFRIK.name,
        legalName: LIAFRIK.legalName,
        url: LIAFRIK.url,
        logo: abs(LIAFRIK.logo),
        slogan: LIAFRIK.tagline.en,
        areaServed: "Africa",
        location: [
          { "@type": "Place", name: "Dubai" },
          { "@type": "Place", name: "Yaoundé" },
        ],
      },
      {
        "@type": "ItemList",
        name: L === "fr" ? "Produits de l'écosystème Liafrik" : "Liafrik ecosystem products",
        itemListElement: PRODUCTS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: p.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: p.text.en,
            url: p.url,
            image: abs(p.logo || p.cover),
            publisher: { "@type": "Organization", name: LIAFRIK.name, url: LIAFRIK.url },
          },
        })),
      },
    ],
  };
}

export const Route = createFileRoute("/_site/ecosysteme")({
  head: () => ({
    meta: [
      { title: COPY.fr.title },
      { name: "description", content: COPY.fr.description },
      { property: "og:title", content: COPY.fr.title },
      { property: "og:description", content: COPY.fr.description },
      { property: "og:image", content: `${SITE}/ecosystem/covers/liafrik.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/ecosysteme` }],
  }),
  component: EcosystemPage,
});

function EcosystemPage() {
  const { lang } = useI18n();
  const L = lang === "fr" ? "fr" : "en";
  const c = COPY[L];
  const json = JSON.stringify(structuredData(L)).replace(/</g, "\\u003c");

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />

      {/* En-tête */}
      <section className="mx-auto max-w-7xl px-5 pb-14 pt-14 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="flex items-center gap-3">
          <span className="rule-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">{c.kicker}</span>
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl font-heading text-[clamp(2.2rem,5vw,3.9rem)] font-semibold leading-[1.05] tracking-tight">{c.h1}</h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">{c.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={LIAFRIK.url} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-[13.5px] font-medium text-background transition-opacity hover:opacity-90">
                {c.visit} <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={LIAFRIK.catalog} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-[13.5px] font-medium transition-colors hover:bg-secondary">
                {c.catalog}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <img src={LIAFRIK.logo} alt="Liafrik" className="h-14 w-auto" />
            <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">{pick(LIAFRIK.tagline, L)}</p>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5">
              {LIAFRIK.presence[L].map((f) => (
                <div key={f.k}>
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{f.k}</dt>
                  <dd className="mt-1 text-[15px] font-semibold">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ArtMarketBand />

      {/* Produits par domaine */}
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <article key={p.id} id={p.id} className="flex flex-col rounded-2xl border border-border bg-card p-7">
              <div className="flex items-start justify-between gap-3">
                <ProductLogo product={p} className="h-14" />
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{pick(GROUPS[p.group], L)}</span>
              </div>
              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{pick(p.label, L)}</p>
              <h3 className="mt-1 font-heading text-2xl font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-1 text-[13px] font-medium" style={{ color: p.accent === "#1D1D1D" ? undefined : p.accent }}>
                {pick(p.alt, L)}
              </p>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">{pick(p.text, L)}</p>
              <ul className="mt-5 space-y-2">
                {pick(p.features, L).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13.5px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                <a href={p.url} target="_blank" rel="noopener" className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity hover:opacity-90">
                  {c.discover} {p.name} <ArrowUpRight className="h-4 w-4" />
                </a>
                {p.sheet !== p.url && (
                  <a href={p.sheet} target="_blank" rel="noopener" className="text-[13px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    {c.sheet}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Le reste du catalogue */}
        <section className="mt-20 rounded-2xl border border-border bg-secondary/40 p-8 lg:p-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">{c.more}</h2>
          <p className="mt-2 text-[14.5px] text-muted-foreground">{c.moreText}</p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {MORE_PRODUCTS.map((m) => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noopener" className="inline-flex h-10 items-center rounded-full border border-border bg-background px-5 text-[13.5px] font-medium transition-colors hover:border-foreground/40">
                  {m.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Appel à l'action */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-5 py-16 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-tight">{c.ctaTitle}</h2>
            <p className="mt-3 text-[15.5px] text-muted-foreground">{c.ctaText}</p>
          </div>
          <Link to="/register" className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-7 text-[14px] font-medium text-background transition-opacity hover:opacity-90">
            {c.ctaButton} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
