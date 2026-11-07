import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/_site/conditions")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation | Afrik Art" },
      { name: "description", content: "Conditions d'utilisation de la plateforme Afrik Art." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Conditions d'utilisation"
      updated="7 novembre 2026"
      intro="En créant un compte sur Afrik Art, vous acceptez les présentes conditions. Elles encadrent l'utilisation de la plateforme par les créateurs comme par les visiteurs, et protègent la qualité des échanges entre les artistes et leur public."
      sections={[
        {
          title: "Objet de la plateforme",
          body: "Afrik Art est un espace de présentation et de découverte dédié aux créateurs africains. La plateforme met en relation des artistes avec un public, des professionnels et des acheteurs potentiels, sans intervenir dans les négociations ni dans les transactions conclues entre les parties.",
        },
        {
          title: "Compte et exactitude des informations",
          body: "Vous êtes responsable de l'exactitude des informations publiées sur votre profil et de la confidentialité de vos identifiants. Un compte peut être suspendu en cas de contenu illicite, trompeur ou portant atteinte aux droits de tiers. Les comptes sont personnels : la cession ou le partage d'accès n'est pas autorisé.",
        },
        {
          title: "Contenus et droits",
          body: "Vous conservez l'intégralité des droits de propriété intellectuelle sur les œuvres que vous publiez. En publiant, vous accordez uniquement à Afrik Art le droit non exclusif d'afficher et de promouvoir ces contenus sur la plateforme et ses supports de communication, pour la durée de leur publication.",
        },
        {
          title: "Journal et modération automatique",
          body: "La publication d'articles dans le journal est une contrepartie de la formule Premium ; l'administration peut également publier des articles officiels. Tout texte est analysé automatiquement avant publication. Les propos liés aux stupéfiants, à la violence, à l'exploitation ou à la fraude sont refusés, et un article déjà publié contenant ces termes est retiré automatiquement du journal. L'administration peut modifier ou supprimer tout article.",
        },
        {
          title: "Abonnements et mises en avant",
          body: "La formule Starter est gratuite. Les formules Pro et Premium ainsi que les mises en avant sont des prestations payantes, facturées en dollars américains. Toute prestation est activée après confirmation du paiement, pour la durée indiquée, et n'est pas renouvelée automatiquement sans votre accord.",
        },
        {
          title: "Comportements interdits",
          body: "Il est interdit d'usurper l'identité d'un tiers, de publier des contenus haineux, violents ou illégaux, de faire l'apologie de produits stupéfiants, d'extraire massivement les données de la plateforme, ou d'utiliser les formulaires de contact à des fins de prospection abusive.",
        },
        {
          title: "Cookies et mesure d'audience",
          body: "La plateforme dépose des cookies nécessaires à son fonctionnement (connexion, langue, sécurité) et, uniquement après votre accord, des cookies de mesure d'audience et de personnalisation. Le détail figure dans la page Cookies, où vous pouvez modifier votre choix à tout moment.",
        },
        {
          title: "Responsabilité",
          body: "Afrik Art met en œuvre les moyens raisonnables pour assurer la disponibilité du service, sans garantie d'absence d'interruption. La plateforme ne peut être tenue responsable des accords conclus entre un créateur et un tiers, ni des contenus publiés par les utilisateurs.",
        },
        {
          title: "Droit applicable",
          body: "Les présentes conditions sont régies par le droit applicable au siège de l'éditeur. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. L'éditeur du service est Liaffrik Tech (Dubaï — Yaoundé).",
        },
      ]}
    />
  ),
});