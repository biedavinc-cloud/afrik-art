import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { HOME_PRODUCT_IDS, LIAFRIK, PRODUCTS, pick } from "@/lib/ecosystem";

const COPY = {
  fr: {
    artKicker: "L'art en Afrique",
    artTitle: "L'art africain mérite un marché à sa hauteur.",
    artText:
      "Exposez vos œuvres sur Afrik Art, racontez-les dans le Journal, puis vendez-les à toute l'Afrique sur Zanldo, dans sa catégorie Art & Artisanat.",
    steps: [
      { n: "01", title: "Se montrer", text: "Un profil et un portfolio qui se partagent d'un lien.", cta: "Explorer les talents", to: "/explorer" },
      { n: "02", title: "Se raconter", text: "Conseils, culture et marché de l'art dans le Journal.", cta: "Lire le Journal", to: "/actualites" },
      { n: "03", title: "Vendre", text: "Des acheteurs dans toute l'Afrique, paiement Mobile Money ou carte.", cta: "Vendre sur Zanldo", href: "https://zanldo.com" },
    ],
    ecoKicker: "Écosystème Liafrik",
    ecoTitle: "L'art a trouvé sa plateforme. Votre activité peut aussi.",
    ecoText:
      "Afrik Art fait partie de Liafrik, un écosystème de logiciels conçus depuis l'Afrique : commerce, éducation, santé, beauté, restauration et gestion d'entreprise.",
    ecoCta: "Découvrir l'écosystème",
    visit: "Découvrir",
  },
  en: {
    artKicker: "Art in Africa",
    artTitle: "African art deserves a market to match.",
    artText:
      "Showcase your work on Afrik Art, tell its story in the Journal, then sell it across Africa on Zanldo, in its Art & Crafts category.",
    steps: [
      { n: "01", title: "Be seen", text: "A profile and portfolio you share with a single link.", cta: "Explore talents", to: "/explorer" },
      { n: "02", title: "Tell the story", text: "Advice, culture and the art market in the Journal.", cta: "Read the Journal", to: "/actualites" },
      { n: "03", title: "Sell", text: "Buyers across Africa, paying by Mobile Money or card.", cta: "Sell on Zanldo", href: "https://zanldo.com" },
    ],
    ecoKicker: "Liafrik ecosystem",
    ecoTitle: "Art found its platform. Your business can too.",
    ecoText:
      "Afrik Art is part of Liafrik, an ecosystem of software designed from Africa: commerce, education, healthcare, beauty, restaurants and business management.",
    ecoCta: "Discover the ecosystem",
    visit: "Discover",
  },
};

export function ProductLogo({ product, className = "h-12" }) {
  if (product.logo) return <img src={product.logo} alt={product.name} loading="lazy" decoding="async" className={`${className} w-auto max-w-full object-contain`} />;
  // Pas de logo fourni : monogramme neutre, jamais un faux logo.
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-semibold text-white" style={{ background: product.accent }} aria-label={product.name}>
      {product.name.charAt(0)}
    </span>
  );
}

// Bloc 1 : parcours de l'artiste, de la visibilité à la vente.
export function ArtMarketBand() {
  const { lang } = useI18n();
  const c = COPY[lang === "fr" ? "fr" : "en"];
  return (
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex items-center gap-3">
          <span className="rule-gold" />
          <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-background/55">{c.artKicker}</span>
        </div>
        <h2 className="mt-7 max-w-3xl font-heading text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.07] tracking-tight">{c.artTitle}</h2>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-background/70">{c.artText}</p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-background/15 md:grid-cols-3">
          {c.steps.map((s) => {
            const body = (
              <>
                <span className="text-[12px] font-medium tracking-[0.2em] text-background/45">{s.n}</span>
                <h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-background/65">{s.text}</p>
                <span className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-medium">
                  {s.cta}
                  {s.href ? <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </>
            );
            const cls = "group flex flex-col bg-foreground p-8 transition-colors hover:bg-background/[0.06]";
            return s.href ? (
              <a key={s.n} href={s.href} target="_blank" rel="noopener" className={cls}>
                {body}
              </a>
            ) : (
              <Link key={s.n} to={s.to} className={cls}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Bloc 2 : les produits de l'écosystème Liafrik.
export default function EcosystemBlock() {
  const { lang } = useI18n();
  const L = lang === "fr" ? "fr" : "en";
  const c = COPY[L];
  const items = HOME_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">{c.ecoKicker}</span>
            </div>
            <h2 className="mt-7 font-heading text-[clamp(2rem,4.2vw,3.2rem)] font-semibold leading-[1.07] tracking-tight">{c.ecoTitle}</h2>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">{c.ecoText}</p>
          </div>
          <div className="flex items-center gap-4">
            <img src={LIAFRIK.logo} alt="Liafrik" loading="lazy" className="hidden h-10 w-auto sm:block" />
            <Link to="/ecosysteme" className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-[13.5px] font-medium text-background transition-opacity hover:opacity-90">
              {c.ecoCta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <li key={p.id}>
              <a href={p.url} target="_blank" rel="noopener" className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-sm">
                <div className="flex h-16 items-center">
                  <ProductLogo product={p} className="h-14" />
                </div>
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{pick(p.label, L)}</p>
                <h3 className="mt-1.5 font-heading text-xl font-semibold tracking-tight">{p.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{pick(p.tagline, L)}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium">
                  {c.visit} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
