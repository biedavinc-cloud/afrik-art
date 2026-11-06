import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Mail, Sparkles } from "lucide-react";
import FaqList from "@/components/site/FaqList";

export const Route = createFileRoute("/_site/faq")({
  head: () => ({
    meta: [
      { title: "FAQ artistes | Afrik Art" },
      {
        name: "description",
        content:
          "Toutes les réponses sur la création de profil, les abonnements, la visibilité et les bonnes pratiques du portfolio.",
      },
    ],
  }),
  component: FaqPage,
});

const SECTIONS = [
  {
    title: "Créer et publier son profil",
    items: [
      {
        q: "Combien de temps prend la création d'un profil ?",
        a: "Environ dix minutes : nom, ville, discipline, biographie et quelques œuvres suffisent pour être en ligne. Vous pourrez compléter votre portfolio à tout moment.",
      },
      {
        q: "Puis-je garder mon profil privé ?",
        a: "Oui. Depuis Paramètres, vous pouvez dépublier votre profil : il disparaît des recherches et des galeries, mais reste accessible depuis votre espace pour continuer à le préparer.",
      },
      {
        q: "Que se passe-t-il si je change de discipline ?",
        a: "Modifiez votre catégorie principale depuis Mon profil. Vos œuvres, demandes de contact et statistiques sont conservées.",
      },
      {
        q: "Puis-je utiliser un pseudonyme ?",
        a: "Oui. Le nom affiché est libre ; l'adresse de votre page est générée à partir de ce nom et peut être ajustée à la création.",
      },
    ],
  },
  {
    title: "Abonnements et visibilité",
    items: [
      {
        q: "Le profil gratuit est-il vraiment gratuit ?",
        a: "Oui, sans limite de durée : page publique, cinq photos, réception des demandes de contact et présence dans les résultats de recherche. Aucune commission n'est prélevée sur vos ventes.",
      },
      {
        q: "À quoi servent les formules Pro et Premium ?",
        a: "Elles augmentent les limites du portfolio (30 puis 200 médias), autorisent plusieurs catégories, ajoutent les statistiques détaillées et améliorent le positionnement dans les résultats.",
      },
      {
        q: "Comment fonctionne une mise en avant ?",
        a: "Vous choisissez une durée (24 h, 3 jours, 7 jours ou 30 jours). Votre profil apparaît en tête de l'accueil et des résultats, avec la mention « Sponsorisé » pour rester transparent.",
      },
      {
        q: "Un profil gratuit reste-t-il visible ?",
        a: "Toujours. Le classement favorise les profils complets et actifs, mais aucun profil publié n'est masqué au profit des abonnés.",
      },
    ],
  },
  {
    title: "Contacts et collaborations",
    items: [
      {
        q: "Comment les clients me contactent-ils ?",
        a: "Depuis votre page publique, un client envoie une demande. Elle arrive dans votre messagerie Afrik Art, vous recevez un email et, si vous l'avez activé, vos coordonnées WhatsApp sont proposées au client.",
      },
      {
        q: "Puis-je répondre sans donner mon email personnel ?",
        a: "Oui. La messagerie interne permet d'échanger sans communiquer votre adresse. Le client est prévenu par email lorsqu'il ne consulte pas son compte.",
      },
      {
        q: "Que faire d'une demande abusive ?",
        a: "Archivez-la et signalez le profil concerné depuis la page publique via le lien de signalement. L'équipe modération traite les signalements sous 48 h.",
      },
    ],
  },
  {
    title: "Bonnes pratiques",
    items: [
      {
        q: "Combien d'œuvres publier ?",
        a: "Mieux vaut huit œuvres fortes que trente images moyennes. Une sélection resserrée donne une lecture claire de votre univers.",
      },
      {
        q: "Quelles images choisir en couverture ?",
        a: "Une image horizontale, lisible même en petit, sans texte incrusté. Elle apparaît dans les résultats de recherche et les partages sur les réseaux.",
      },
      {
        q: "Faut-il écrire un blog ?",
        a: "C'est un vrai levier : un article qui raconte une série, un voyage ou une méthode vous rend mémorable et améliore votre référencement.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8 lg:py-16">
      <p className="label-caps">Aide</p>
      <h1 className="mt-3 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
        Questions fréquentes des artistes
      </h1>
      <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
        Profil, abonnements, contacts, visibilité : tout ce qu'il faut savoir avant de publier
        votre travail sur Afrik Art.
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 flex items-center gap-2 text-[17px] font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> {section.title}
            </h2>
            <FaqList items={section.items} />
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-[14px] font-medium">Votre question n'est pas ici ?</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              L'équipe support répond sous 24 à 48 heures ouvrées.
            </p>
          </div>
        </div>
        <Link
          to="/support"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[12.5px] font-medium text-background"
        >
          <Mail className="h-4 w-4" /> Contacter le support
        </Link>
      </div>
    </div>
  );
}