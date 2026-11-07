import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

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
      updated="7 novembre 2026"
      intro="Nous collectons le minimum nécessaire pour faire fonctionner la plateforme et mettre les créateurs en relation avec leur public. Aucune donnée n'est vendue, et vous gardez la main sur ce qui est public."
      extra={<CookiePreferencesButton />}
      sections={[
        {
          title: "Données collectées",
          body: "Lors de la création d'un compte : adresse e-mail, mot de passe chiffré, nom, pays, ville, catégorie artistique principale et nom professionnel. Lors de l'utilisation : contenus publiés, médias de votre portfolio, messages envoyés via les formulaires de contact, et données techniques de connexion (adresse IP, type d'appareil).",
        },
        {
          title: "Utilisation de vos données",
          body: "Ces données servent à afficher votre profil public, à vous permettre de recevoir des demandes de contact, à gérer votre abonnement, à sécuriser votre compte et à établir des statistiques agrégées de visites. Elles ne sont jamais vendues ni cédées à des tiers à des fins commerciales.",
        },
        {
          title: "Données publiques",
          body: "Votre nom professionnel, votre ville, votre pays, votre biographie, votre portfolio et vos liens publics sont visibles par tous. Votre adresse e-mail de connexion n'est jamais publiée : les visiteurs vous contactent via le formulaire, qui vous transmet leur message. Vous pouvez dépublier votre profil à tout moment.",
        },
        {
          title: "Paiements",
          body: "Les paiements sont traités par un prestataire certifié. Aucun numéro de carte bancaire n'est stocké sur nos serveurs. Nous conservons uniquement l'historique des transactions (montant, date, statut) pour la comptabilité, la facturation et votre suivi.",
        },
        {
          title: "Cookies et mesure d'audience",
          body: "Les cookies indispensables (connexion, langue, sécurité, mémorisation de votre choix) sont toujours actifs. Les cookies de mesure d'audience et de personnalisation ne sont posés qu'avec votre accord, que vous pouvez retirer à tout moment depuis la page Cookies ou le bouton ci-dessus.",
        },
        {
          title: "Conservation et sécurité",
          body: "Les données sont conservées le temps de l'activité du compte, puis supprimées sur demande dans un délai raisonnable. L'accès aux données est restreint aux personnes habilitées et protégé par des contrôles d'autorisation : chaque compte ne voit que ses propres enregistrements.",
        },
        {
          title: "Vos droits",
          body: "Vous pouvez demander l'accès, la rectification, l'export ou la suppression de vos données, ainsi que la désactivation de votre profil public, depuis votre espace ou en contactant l'équipe de la plateforme. Une réponse vous est apportée dans les meilleurs délais.",
        },
      ]}
    />
  ),
});