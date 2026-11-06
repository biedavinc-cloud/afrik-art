// Valeurs par défaut des formules. L'administration peut les modifier
// (entité PlanConfig) ; ces valeurs servent de repli.
export const DEFAULT_PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: 0,
    badge: null,
    tagline: "Se faire connaître",
    tagline_en: "Get discovered",
    mediaLimit: 5,
    categoriesLimit: 1,
    features: [
      "Profil public indexé",
      "Jusqu'à 5 photos de portfolio",
      "Une catégorie principale",
      "Biographie, pays et ville",
      "Réseaux sociaux",
      "Demandes de contact",
      "Statistiques simples",
    ],
    features_en: [
      "Indexed public profile",
      "Up to 5 portfolio photos",
      "One main category",
      "Biography, country and city",
      "Social links",
      "Contact requests",
      "Basic statistics",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: 9,
    badge: "Pro",
    tagline: "Développer sa visibilité",
    tagline_en: "Grow your visibility",
    mediaLimit: 30,
    categoriesLimit: 3,
    features: [
      "Jusqu'à 30 photos et vidéos",
      "Plusieurs catégories artistiques",
      "Badge Pro vérifié",
      "Statistiques de visites et de contacts",
      "Meilleur positionnement dans les recherches",
      "Personnalisation du profil",
      "Gestion des demandes de collaboration",
    ],
    features_en: [
      "Up to 30 photos and videos",
      "Several artistic categories",
      "Verified Pro badge",
      "Visit and contact statistics",
      "Better ranking in search",
      "Profile customisation",
      "Collaboration request management",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: 29,
    badge: "Premium",
    tagline: "Pour les professionnels et studios",
    tagline_en: "For professionals and studios",
    mediaLimit: 200,
    categoriesLimit: 6,
    features: [
      "Portfolio étendu (200 médias)",
      "Badge Premium",
      "Personnalisation avancée",
      "Statistiques détaillées",
      "Priorité dans les résultats",
      "Visibilité renforcée",
      "Accès aux opportunités professionnelles",
    ],
    features_en: [
      "Extended portfolio (200 media)",
      "Premium badge",
      "Advanced customisation",
      "Detailed statistics",
      "Priority in results",
      "Enhanced visibility",
      "Access to professional opportunities",
    ],
  },
];

export const PLAN_LABELS = { starter: "Starter", pro: "Pro", premium: "Premium" };

export const BOOST_PACKAGES = [
  { hours: 24, label: "24 heures", label_en: "24 hours", price: 2 },
  { hours: 72, label: "3 jours", label_en: "3 days", price: 5 },
  { hours: 168, label: "7 jours", label_en: "7 days", price: 9 },
  { hours: 720, label: "30 jours", label_en: "30 days", price: 19 },
];

export const planByKey = (key) =>
  DEFAULT_PLANS.find((p) => p.key === key) || DEFAULT_PLANS[0];

// Sélectionne le libellé d'une formule selon la langue active, en revenant
// au contenu de la base (souvent monolingue) quand la traduction manque.
export function localizedPlan(plan, lang) {
  const fallback = DEFAULT_PLANS.find((p) => p.key === plan.key);
  if (lang !== "en") return plan;
  return {
    ...plan,
    tagline: plan.tagline_en || fallback?.tagline_en || plan.tagline,
    features: plan.features_en || fallback?.features_en || plan.features,
  };
}