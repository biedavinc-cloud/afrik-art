import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Camera, Globe2, PenLine, Sparkles, TrendingUp } from "lucide-react";
import FaqList from "@/components/site/FaqList";

export const Route = createFileRoute("/_site/guide-artiste")({
  head: () => ({
    meta: [
      { title: "Guide artiste | Afrik Art" },
      {
        name: "description",
        content:
          "Méthode concrète pour construire un portfolio convaincant, écrire sa biographie et gagner en visibilité sur Afrik Art.",
      },
    ],
  }),
  component: GuidePage,
});

const STEPS = [
  {
    icon: Camera,
    title: "1. Sélectionnez, ne montrez pas tout",
    text: "Huit à douze œuvres suffisent. Écartez ce qui vous ressemble le moins : un portfolio se juge sur son point faible. Si vous hésitez entre deux images, gardez celle qui raconte le plus.",
    tips: ["Une seule direction visuelle par série", "Formats homogènes", "Pas de filigrane envahissant"],
  },
  {
    icon: BookOpen,
    title: "2. Écrivez une biographie utile",
    text: "Trois paragraphes : qui vous êtes et d'où vous travaillez, ce que vous cherchez à montrer, ce que vous avez réalisé. Mentionnez les expositions, résidences et collaborations avec leurs dates.",
    tips: ["150 à 250 mots", "Pas de superlatifs vides", "Terminez par ce que vous cherchez aujourd'hui"],
  },
  {
    icon: Globe2,
    title: "3. Soignez la couverture et le titre",
    text: "Votre image de couverture est votre affiche. Choisissez une image horizontale, contrastée, lisible en vignette. La phrase d'accroche doit tenir en une ligne et dire votre pratique.",
    tips: ["Image testée en petit format", "Accroche sans jargon", "Ville et pays renseignés"],
  },
  {
    icon: PenLine,
    title: "4. Publiez régulièrement dans le blog",
    text: "Un article par mois suffit : retour sur une série, carnet de voyage, méthode de travail. Les articles sont indexés et ramènent des visiteurs vers votre profil toute l'année.",
    tips: ["Un titre concret", "Une image de couverture", "800 à 1200 mots"],
  },
  {
    icon: TrendingUp,
    title: "5. Travaillez votre visibilité",
    text: "Complétez votre profil à 100 %, activez les mises en avant lors d'une actualité (exposition, sortie de livre), et répondez vite aux demandes : la réactivité est un critère de classement.",
    tips: ["Répondre sous 48 h", "Mettre à jour la disponibilité", "Partager votre page sur vos réseaux"],
  },
  {
    icon: Sparkles,
    title: "6. Transformez un contact en collaboration",
    text: "Une demande sérieuse contient un projet, des dates et un budget. Répondez avec vos tarifs, vos conditions de cession de droits et un délai de livraison clair.",
    tips: ["Toujours préciser les droits d'utilisation", "Un devis écrit", "Un acompte avant production"],
  },
];

const FAQ = [
  {
    q: "Faut-il un site personnel en plus ?",
    a: "Non, mais rien ne l'interdit. Votre page Afrik Art peut servir de portfolio principal : elle est indexée, partageable et pensée pour être lue par des professionnels.",
  },
  {
    q: "Mes images sont-elles protégées ?",
    a: "Vous restez propriétaire de vos œuvres. Nous n'utilisons vos images que pour afficher votre profil et vos articles. Le lien de signalement permet de faire retirer toute reproduction non autorisée.",
  },
  {
    q: "Dois-je répondre à toutes les demandes ?",
    a: "Non, mais un refus poli est préférable au silence. Un modèle de réponse en trois lignes suffit et préserve votre réputation.",
  },
];

function GuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <p className="label-caps">Guide</p>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.1rem)] font-semibold leading-tight">
          Construire un portfolio qui vous rend inoubliable
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
          Six étapes concrètes, tirées de l'expérience de galeristes, directeurs artistiques et
          créateurs déjà présents sur la plateforme.
        </p>
      </div>

      <div className="mt-12 space-y-5">
        {STEPS.map((step) => (
          <section
            key={step.title}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-semibold">{step.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {step.tips.map((tip) => (
                    <li
                      key={tip}
                      className="rounded-full bg-secondary px-3 py-1 text-[11.5px] text-foreground/70"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-[19px] font-semibold">Questions de méthode</h2>
        <FaqList items={FAQ} className="mt-5" />
      </section>

      <div className="mt-12 rounded-2xl bg-foreground p-8 text-background sm:p-10">
        <h2 className="text-[22px] font-semibold">Prêt à ouvrir votre portfolio ?</h2>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-background/70">
          Le profil de base est gratuit, sans commission sur vos ventes et sans engagement.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground"
          >
            Créer mon profil <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 rounded-full border border-background/25 px-5 py-2.5 text-[12.5px] font-medium text-background"
          >
            Consulter la FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}