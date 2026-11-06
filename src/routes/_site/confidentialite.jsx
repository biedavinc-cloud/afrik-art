import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/_site/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | Afrik Art" },
      { name: "description", content: "Comment Afrik Art collecte et protège vos données personnelles." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Politique de confidentialité"
      updated="6 novembre 2026"
      intro="Nous collectons le minimum nécessaire pour faire fonctionner la plateforme et mettre les créateurs en relation avec leur public."
      sections={[
        {
          title: "Données collectées",
          body: "Lors de la création d'un compte : nom, adresse email, pays, ville, catégorie artistique principale et nom professionnel. Lors de l'utilisation : contenus publiés, messages envoyés via les formulaires de contact, et données techniques de connexion.",
        },
        {
          title: "Utilisation",
          body: "Ces données servent à afficher votre profil public, à vous permettre de recevoir des demandes de contact, à établir des statistiques agrégées de visites et à gérer votre abonnement. Elles ne sont jamais vendues à des tiers.",
        },
        {
          title: "Données publiques",
          body: "Votre nom professionnel, votre ville, votre pays, votre biographie, votre portfolio et vos liens publics sont visibles par tous. Votre adresse email de connexion n'est jamais publiée : les visiteurs vous contactent via le formulaire, qui vous transmet leur message.",
        },
        {
          title: "Paiements",
          body: "Les paiements sont traités par un prestataire certifié. Aucun numéro de carte bancaire n'est stocké sur nos serveurs. Nous conservons uniquement l'historique des transactions (montant, date, statut) pour la comptabilité et votre suivi.",
        },
        {
          title: "Conservation et sécurité",
          body: "Les données sont conservées le temps de l'activité du compte, puis supprimées sur demande. L'accès aux données est restreint aux personnes habilitées et protégé par des contrôles d'autorisation.",
        },
        {
          title: "Vos droits",
          body: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données, ainsi que la désactivation de votre profil public, depuis votre espace ou en contactant l'équipe de la plateforme.",
        },
      ]}
    />
  ),
});