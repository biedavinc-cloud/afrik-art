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
      updated="6 novembre 2026"
      intro="En créant un compte sur Afrik Art, vous acceptez les présentes conditions. Elles encadrent l'utilisation de la plateforme par les créateurs et par les visiteurs."
      sections={[
        {
          title: "1. Objet de la plateforme",
          body: "Afrik Art est un espace de présentation et de découverte dédié aux créateurs africains. La plateforme met en relation des artistes avec un public, des professionnels et des acheteurs potentiels, sans intervenir dans les négociations entre les parties.",
        },
        {
          title: "2. Compte et exactitude des informations",
          body: "Vous êtes responsable de l'exactitude des informations publiées sur votre profil et de la confidentialité de vos identifiants. Un compte peut être suspendu en cas de contenu illicite, trompeur ou portant atteinte aux droits de tiers.",
        },
        {
          title: "3. Contenus et droits",
          body: "Vous conservez l'intégralité des droits de propriété intellectuelle sur les œuvres que vous publiez. En publiant, vous accordez uniquement à Afrik Art le droit non exclusif d'afficher et de promouvoir ces contenus sur la plateforme et ses supports de communication, pour la durée de leur publication.",
        },
        {
          title: "4. Abonnements et mises en avant",
          body: "La formule Starter est gratuite. Les formules Pro et Premium ainsi que les mises en avant sont des prestations payantes, facturées en dollars américains. Toute prestation est activée après confirmation du paiement, pour la durée indiquée, et n'est pas renouvelée automatiquement sans votre accord.",
        },
        {
          title: "5. Comportements interdits",
          body: "Il est interdit d'usurper l'identité d'un tiers, de publier des contenus haineux ou illégaux, d'extraire massivement les données de la plateforme, ou d'utiliser les formulaires de contact à des fins de prospection abusive.",
        },
        {
          title: "6. Responsabilité",
          body: "Afrik Art met en œuvre les moyens raisonnables pour assurer la disponibilité du service, sans garantie d'absence d'interruption. La plateforme ne peut être tenue responsable des accords conclus entre un créateur et un tiers.",
        },
        {
          title: "7. Droit applicable",
          body: "Les présentes conditions sont régies par le droit applicable au siège de l'éditeur. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.",
        },
      ]}
    />
  ),
});