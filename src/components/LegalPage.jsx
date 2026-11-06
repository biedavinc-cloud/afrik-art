import { Link } from "@tanstack/react-router";

export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="label-caps">
        <Link to="/" className="hover:text-foreground">Accueil</Link> · Légal
      </p>
      <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">{title}</h1>
      <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
        Mise à jour : {updated}
      </p>
      <p className="mt-7 text-[14.5px] leading-relaxed text-foreground/75">{intro}</p>

      <div className="mt-12 space-y-9">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-[17px] font-medium">{s.title}</h2>
            <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}