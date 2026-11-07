import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText, ShieldCheck } from "lucide-react";

// Gabarit éditorial des pages légales : bandeau, sommaire collant, sections
// numérotées et bloc de contact.
export default function LegalPage({ title, updated, intro, sections, extra }) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative border-b border-border bg-secondary/40">
        <div className="pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl anim-aurora" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
          <p className="label-caps">
            <Link to="/" className="transition-colors hover:text-foreground">
              Accueil
            </Link>
            <span className="px-2 text-border">/</span> Légal
          </p>
          <h1 className="fade-up mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.1rem)] font-semibold leading-[1.05]">
            {title}
          </h1>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Mise à jour : {updated}
          </p>
          <p className="mt-6 max-w-3xl text-[14.5px] leading-relaxed text-foreground/70">{intro}</p>
          {extra && <div className="mt-6">{extra}</div>}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-20">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="label-caps">Sommaire</p>
            <nav className="mt-4 border-l border-border">
              {sections.map((s, i) => (
                <a
                  key={s.title}
                  href={`#section-${i}`}
                  className="block border-l-2 border-transparent py-1.5 pl-3 text-[12.5px] text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                >
                  {s.title}
                </a>
              ))}
            </nav>
            <Link
              to="/cookies"
              className="mt-6 inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
            >
              Cookies et traceurs <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map((s, i) => (
            <section
              key={s.title}
              id={`section-${i}`}
              className="fade-up group scroll-mt-24 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-sm lg:p-7"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-foreground/60 transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                  {i + 1}
                </span>
                <div>
                  <h2 className="text-[15.5px] font-medium leading-snug">{s.title}</h2>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </div>
            </section>
          ))}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-5">
            <p className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <FileText className="h-4 w-4 text-accent" /> Une question sur ce document ?
            </p>
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[12px] font-medium text-background"
            >
              Contacter l'équipe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}