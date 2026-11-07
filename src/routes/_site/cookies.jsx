import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const Route = createFileRoute("/_site/cookies")({
  head: () => ({
    meta: [
      { title: "Cookies et traceurs | Afrik Art" },
      {
        name: "description",
        content:
          "Quels cookies Afrik Art utilise, pourquoi, et comment modifier vos préférences à tout moment.",
      },
    ],
  }),
  component: () => (
    <LegalPage
      title="Cookies et traceurs"
      updated="7 novembre 2026"
      intro="Afrik Art utilise un nombre volontairement limité de cookies. Les cookies essentiels font fonctionner la plateforme ; les autres ne sont posés qu'après votre accord explicite, et vous pouvez revenir sur ce choix à tout moment."
      extra={<CookiePreferencesButton />}
      sections={[
        {
          title: "1. Ce qu'est un cookie",
          body: "Un cookie est un petit fichier déposé par votre navigateur sur votre appareil. Il permet par exemple de rester connecté, de conserver la langue d'affichage ou de mesurer la fréquentation d'une page. Certains stockages locaux (localStorage) remplissent une fonction équivalente et suivent les mêmes règles.",
        },
        {
          title: "2. Cookies strictement nécessaires",
          body: "Ils assurent la connexion à votre espace, la sécurité des formulaires, la mémorisation de la langue et de votre choix de consentement. Sans eux, la plateforme ne fonctionne pas : ils ne peuvent pas être désactivés.",
        },
        {
          title: "3. Mesure d'audience",
          body: "Avec votre accord, nous mesurons de manière agrégée les pages consultées, la provenance des visites et les parcours qui mènent à une inscription. Ces statistiques nous aident à améliorer la plateforme et ne servent jamais à vous identifier personnellement.",
        },
        {
          title: "4. Personnalisation et campagnes",
          body: "Avec votre accord, des cookies peuvent être utilisés pour adapter les contenus mis en avant et mesurer l'efficacité de nos campagnes de promotion de la plateforme et des artistes. Aucune donnée bancaire n'est concernée.",
        },
        {
          title: "5. Modifier ou retirer votre accord",
          body: "Le bandeau de consentement s'affiche lors de votre première visite et enregistre votre choix. Pour le modifier, utilisez le bouton « Gérer mes préférences » ci-dessus : le bandeau réapparaît et votre nouveau choix s'applique immédiatement. Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur.",
        },
        {
          title: "6. Durée de conservation",
          body: "Votre choix de consentement est conservé jusqu'à ce que vous le modifiiez. Les cookies de mesure d'audience ont une durée de vie limitée et sont renouvelés périodiquement, sans prolongation automatique de votre accord.",
        },
      ]}
    />
  ),
});