import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/_site/droits-auteur")({
  head: () => ({
    meta: [
      { title: "Droits d'auteur | Afrik Art" },
      { name: "description", content: "Les créateurs conservent tous les droits sur leurs œuvres publiées sur Afrik Art." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Politique de droits d'auteur"
      updated="6 novembre 2026"
      intro="Afrik Art ne s'approprie aucun contenu publié par les créateurs. Cette page explique ce que vous accordez, ce que vous conservez, et comment signaler une atteinte."
      sections={[
        {
          title: "Vous restez propriétaire",
          body: "Chaque œuvre, photographie, vidéo ou texte publié reste la propriété exclusive de son auteur. La publication sur la plateforme ne transfère aucun droit de propriété intellectuelle.",
        },
        {
          title: "Licence d'affichage limitée",
          body: "Vous accordez à Afrik Art une licence non exclusive, mondiale et gratuite, limitée à l'affichage de vos contenus sur la plateforme et à leur promotion (page d'accueil, sélections éditoriales, réseaux sociaux de la plateforme). Cette licence prend fin lorsque vous retirez le contenu.",
        },
        {
          title: "Exploitation commerciale",
          body: "Toute vente, reproduction ou exploitation commerciale d'une œuvre par un tiers nécessite votre accord direct. Afrik Art ne vend pas vos œuvres et ne prélève aucune commission sur les accords que vous concluez.",
        },
        {
          title: "Signalement",
          body: "Si vous estimez qu'un contenu publié porte atteinte à vos droits, utilisez le bouton « Signaler » présent sur le profil concerné, ou contactez l'équipe de la plateforme en précisant l'œuvre, le profil visé et la preuve de votre titularité. Les contenus signalés sont examinés et peuvent être retirés.",
        },
        {
          title: "Retrait de vos contenus",
          body: "Vous pouvez supprimer à tout moment une œuvre depuis votre espace personnel. La suppression est effective immédiatement sur la plateforme ; les caches de moteurs de recherche peuvent conserver une copie pendant quelques jours.",
        },
      ]}
    />
  ),
});