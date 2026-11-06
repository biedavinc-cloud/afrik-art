// Dictionnaires FR / EN / ES / PT / SW — plateforme Afrik Art.
// Clés plates : "section.sous-section.cle". Le français sert de repli.
import { es } from "@/lib/dictionaries/es";
import { pt } from "@/lib/dictionaries/pt";
import { sw } from "@/lib/dictionaries/sw";

export const DICTIONARIES = {
  fr: {
    "brand.name": "Afrik Art",
    "brand.tagline": "Talents · Culture",

    "nav.home": "Accueil",
    "nav.explore": "Explorer",
    "nav.categories": "Catégories",
    "nav.pricing": "Tarifs",
    "nav.gallery": "Galerie",
    "nav.journal": "Journal",
    "nav.search": "Recherche avancée",
    "nav.guide": "Guide artiste",
    "nav.faq": "FAQ artistes",
    "nav.support": "Aide",
    "nav.top": "Top artistes",
    "nav.contact": "Contact artiste",
    "footer.discover": "Découvrir",
    "footer.resources": "Ressources",

    "header.search": "Rechercher un talent",
    "header.login": "Connexion",
    "header.signup": "Créer mon profil",
    "header.space": "Mon espace",

    "home.hero.eyebrow": "Plateforme panafricaine des talents",
    "home.hero.t1": "Le talent africain",
    "home.hero.t2": "mérite une scène",
    "home.hero.accent": "mondiale.",
    "home.hero.text":
      "Afrik Art réunit photographes, peintres, musiciens, stylistes et créateurs du continent. Un portfolio professionnel, une audience internationale, des opportunités réelles.",
    "home.hero.cta": "Découvrir les talents",
    "home.hero.cta2": "Créer mon profil",
    "home.hero.s1": "disciplines créatives",
    "home.hero.s2": "pays africains",
    "home.hero.s3": "pour commencer",

    "home.cat.eyebrow": "Disciplines",
    "home.cat.title": "Catégories populaires",
    "home.cat.all": "Toutes les catégories",
    "home.cat.count": "{n} catégories",

    "home.feat.eyebrow": "Mise en avant",
    "home.feat.title": "Artistes à découvrir",
    "home.feat.text":
      "Des profils sélectionnés pour la qualité de leur travail et la richesse de leur univers.",
    "home.feat.link": "Voir les {n} talents",

    "home.recent.eyebrow": "Nouveaux talents",
    "home.recent.title": "Récemment inscrits",
    "home.recent.text": "Les créateurs qui viennent de rejoindre la plateforme.",
    "home.recent.link": "Explorer",

    "home.geo.eyebrow": "Géographie",
    "home.geo.title": "Talents par pays",
    "home.geo.count": "{n} talent",
    "home.geo.countPlural": "{n} talents",

    "home.plans.eyebrow": "Abonnements",
    "home.plans.title": "Commencez gratuitement. Grandissez quand vous voulez.",
    "home.plans.text":
      "Aucune commission sur vos ventes futures. Les limites de portfolio sont appliquées automatiquement selon votre formule.",
    "home.plans.note":
      "Paiement en dollars américains. Activation après confirmation du paiement.",

    "home.cta.title": "Votre travail mérite d'être vu.",
    "home.cta.text":
      "Rejoignez les créateurs qui présentent leur univers au monde depuis l'Afrique. Profil gratuit, sans engagement.",
    "home.cta.button": "Créer mon profil",

    "how.eyebrow": "La plateforme",
    "how.title": "Où la créativité africaine trouve sa scène",
    "how.text":
      "Afrik Art n'est pas un réseau social de plus. C'est un espace professionnel de découverte : chaque profil est conçu pour être partagé, référencé et pris au sérieux.",
    "how.cta": "Ouvrir mon portfolio",
    "how.s1t": "Créez votre profil",
    "how.s1x":
      "Nom, ville, discipline, biographie, réseaux. Votre page publique est en ligne immédiatement, avec une adresse dédiée.",
    "how.s2t": "Publiez votre portfolio",
    "how.s2x":
      "Photos et vidéos organisées comme une exposition. Vous gardez l'intégralité des droits sur vos œuvres.",
    "how.s3t": "Soyez découvert",
    "how.s3x":
      "Les visiteurs, galeries, marques et journalistes vous trouvent par pays, discipline ou recherche, et vous contactent directement.",

    "mission.eyebrow": "Notre engagement",
    "mission.title":
      "Une plateforme construite pour les créateurs, pas pour les algorithmes.",
    "mission.p1":
      "Notre mission : offrir un espace gratuit et ouvert où les artistes africains partagent leur travail, gagnent en visibilité et nouent des relations durables avec des publics et des professionnels du monde entier.",
    "mission.p2":
      "Notre vision : devenir la destination de référence pour l'art et la culture africains — un lieu où chaque voix est entendue, chaque récit respecté, et la richesse du continent montrée au monde.",
    "mission.since": "Depuis 2026",
    "mission.badge":
      "Une scène ouverte, sans commission sur votre visibilité.",
    "mission.r1t": "Vos droits préservés",
    "mission.r1x": "Vous restez propriétaire de toutes vos œuvres.",
    "mission.r2t": "Visibilité loyale",
    "mission.r2x": "Les profils gratuits restent visibles dans les résultats.",
    "mission.cta": "Parcourir les disciplines",

    "footer.about":
      "La plateforme panafricaine qui donne aux créateurs du continent une scène internationale, sans intermédiaire.",
    "footer.claim": "Le talent n'a pas de frontière",
    "footer.platform": "Plateforme",
    "footer.creators": "Créateurs",
    "footer.legal": "Légal",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Confidentialité",
    "footer.rights": "Droits d'auteur",
    "footer.login": "Se connecter",
    "footer.copy": "Les œuvres restent la propriété de leurs auteurs.",
    "footer.made": "Conçu pour l'Afrique, ouvert au monde.",
    "footer.dev": "Développé par",

    "explorer.eyebrow": "Catalogue",
    "explorer.title": "Explorer les talents",
    "explorer.count": "{n} profil correspondant à votre recherche.",
    "explorer.countPlural": "{n} profils correspondant à votre recherche.",
    "explorer.countNote":
      "Les profils sponsorisés sont signalés ; les artistes gratuits restent visibles dans les résultats.",
    "explorer.q": "Rechercher un nom, un pseudonyme ou une spécialité",
    "explorer.search": "Rechercher",
    "explorer.filters": "Filtres",
    "explorer.reset": "Réinitialiser",
    "explorer.country": "Pays",
    "explorer.city": "Ville",
    "explorer.category": "Catégorie",
    "explorer.specialty": "Spécialité",
    "explorer.specialtyPh": "Ex. portrait documentaire",
    "explorer.availability": "Disponibilité",
    "explorer.allCountries": "Tous les pays",
    "explorer.allCities": "Toutes les villes",
    "explorer.allCats": "Toutes les disciplines",
    "explorer.all": "Toutes",
    "explorer.apply": "Appliquer",
    "explorer.proOnly": "Profils Pro et Premium uniquement",
    "explorer.empty": "Aucun talent ne correspond encore.",
    "explorer.emptyText": "Élargissez vos critères ou explorez toutes les disciplines.",
    "explorer.resetFilters": "Réinitialiser les filtres",
    "explorer.sort.relevance": "Pertinence",
    "explorer.sort.recent": "Plus récents",
    "explorer.sort.popular": "Plus consultés",
    "explorer.closeFilters": "Fermer les filtres",

    "avail.available": "Disponible pour des projets",
    "avail.open_to_collab": "Ouvert aux collaborations",
    "avail.busy": "Agenda chargé",

    "cats.eyebrow": "Disciplines",
    "cats.title": "Toutes les catégories",
    "cats.text":
      "Quinze familles de pratiques, du portrait documentaire à l'art numérique. Choisissez une discipline pour découvrir les créateurs qui la font vivre.",

    "pricing.eyebrow": "Abonnements",
    "pricing.title": "Trois formules, un seul objectif : votre visibilité.",
    "pricing.text":
      "Aucune commission sur vos ventes. Les prix sont exprimés en dollars américains. Les limites de portfolio sont appliquées automatiquement.",
    "pricing.boost.eyebrow": "Booster un profil",
    "pricing.boost.title": "Mises en avant à la durée",
    "pricing.boost.text":
      "Apparaissez en tête de l'accueil, des résultats et des pages catégories. Le badge « Sponsorisé » garantit la transparence.",
    "pricing.boost.cta": "Booster mon profil",
    "pricing.faq": "Questions fréquentes",
    "pricing.faq1q": "Puis-je rester gratuit ?",
    "pricing.faq1a":
      "Oui. La formule Starter est gratuite et sans limite de durée : profil public, 5 photos, réception des demandes de contact et présence dans les résultats de recherche.",
    "pricing.faq2q": "Comment fonctionne le paiement ?",
    "pricing.faq2a":
      "Vous choisissez votre formule depuis votre espace : une demande est créée avec son montant. La prestation est activée dès que le paiement est confirmé. Aucun prélèvement automatique n'est effectué sans votre accord explicite.",
    "pricing.faq3q": "Les artistes gratuits restent-ils visibles ?",
    "pricing.faq3a":
      "Oui. Le classement favorise les profils complets et actifs, et les mises en avant sont identifiées comme sponsorisées. Un profil gratuit n'est jamais masqué.",
    "pricing.faq4q": "Que se passe-t-il si j'atteins la limite de mon portfolio ?",
    "pricing.faq4a":
      "La limite est appliquée automatiquement : votre portfolio affiche le nombre de médias inclus dans votre formule. Vous pouvez passer à une formule supérieure à tout moment.",
    "pricing.faq5q": "Puis-je annuler ?",
    "pricing.faq5a":
      "Oui, à tout moment. Votre profil repasse en formule Starter à la fin de la période en cours, sans perte de contenu au-delà de la limite Starter.",

    "plan.mostChosen": "Le plus choisi",
    "plan.perMonth": "/ mois",
    "plan.start": "Commencer gratuitement",
    "plan.choose": "Choisir {name}",

    "artist.sponsored": "Sponsorisé",

    "common.loading": "Chargement…",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
  },

  en: {
    "brand.name": "Afrik Art",
    "brand.tagline": "Talents · Culture",

    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.categories": "Categories",
    "nav.pricing": "Pricing",
    "nav.gallery": "Gallery",
    "nav.journal": "Journal",
    "nav.search": "Advanced search",
    "nav.guide": "Artist guide",
    "nav.faq": "Artist FAQ",
    "nav.support": "Help",
    "nav.top": "Top artists",
    "nav.contact": "Contact an artist",
    "footer.discover": "Discover",
    "footer.resources": "Resources",

    "header.search": "Search for a talent",
    "header.login": "Sign in",
    "header.signup": "Create my profile",
    "header.space": "My space",

    "home.hero.eyebrow": "Pan-African talent platform",
    "home.hero.t1": "African talent",
    "home.hero.t2": "deserves a",
    "home.hero.accent": "global stage.",
    "home.hero.text":
      "Afrik Art brings together photographers, painters, musicians, designers and makers from across the continent. A professional portfolio, an international audience, real opportunities.",
    "home.hero.cta": "Discover talents",
    "home.hero.cta2": "Create my profile",
    "home.hero.s1": "creative disciplines",
    "home.hero.s2": "African countries",
    "home.hero.s3": "to get started",

    "home.cat.eyebrow": "Disciplines",
    "home.cat.title": "Popular categories",
    "home.cat.all": "All categories",
    "home.cat.count": "{n} categories",

    "home.feat.eyebrow": "Featured",
    "home.feat.title": "Artists to discover",
    "home.feat.text":
      "Profiles selected for the quality of their work and the richness of their vision.",
    "home.feat.link": "See all {n} talents",

    "home.recent.eyebrow": "New talents",
    "home.recent.title": "Recently joined",
    "home.recent.text": "The creators who just joined the platform.",
    "home.recent.link": "Explore",

    "home.geo.eyebrow": "Geography",
    "home.geo.title": "Talents by country",
    "home.geo.count": "{n} talent",
    "home.geo.countPlural": "{n} talents",

    "home.plans.eyebrow": "Plans",
    "home.plans.title": "Start for free. Grow whenever you want.",
    "home.plans.text":
      "No commission on your future sales. Portfolio limits are applied automatically according to your plan.",
    "home.plans.note": "Prices in US dollars. Activated once payment is confirmed.",

    "home.cta.title": "Your work deserves to be seen.",
    "home.cta.text":
      "Join the creators presenting their world from Africa. Free profile, no commitment.",
    "home.cta.button": "Create my profile",

    "how.eyebrow": "The platform",
    "how.title": "Where African creativity finds its stage",
    "how.text":
      "Afrik Art is not just another social network. It is a professional discovery space: every profile is built to be shared, indexed and taken seriously.",
    "how.cta": "Open my portfolio",
    "how.s1t": "Create your profile",
    "how.s1x":
      "Name, city, discipline, biography, social links. Your public page goes live immediately with its own address.",
    "how.s2t": "Publish your portfolio",
    "how.s2x":
      "Photos and videos arranged like an exhibition. You keep every right to your work.",
    "how.s3t": "Get discovered",
    "how.s3x":
      "Visitors, galleries, brands and journalists find you by country, discipline or search — and contact you directly.",

    "mission.eyebrow": "Our commitment",
    "mission.title": "A platform built for creators, not for algorithms.",
    "mission.p1":
      "Our mission: a free, open space where African artists share their work, gain visibility and build lasting relationships with audiences and professionals worldwide.",
    "mission.p2":
      "Our vision: to become the reference destination for African art and culture — a place where every voice is heard, every story respected, and the richness of the continent shown to the world.",
    "mission.since": "Since 2026",
    "mission.badge": "An open stage, with no commission on your visibility.",
    "mission.r1t": "Your rights preserved",
    "mission.r1x": "You remain the owner of all your work.",
    "mission.r2t": "Fair visibility",
    "mission.r2x": "Free profiles stay visible in search results.",
    "mission.cta": "Browse disciplines",

    "footer.about":
      "The Pan-African platform giving creators from the continent an international stage, with no middleman.",
    "footer.claim": "Talent has no border",
    "footer.platform": "Platform",
    "footer.creators": "Creators",
    "footer.legal": "Legal",
    "footer.terms": "Terms of use",
    "footer.privacy": "Privacy",
    "footer.rights": "Copyright",
    "footer.login": "Sign in",
    "footer.copy": "Artworks remain the property of their authors.",
    "footer.made": "Built for Africa, open to the world.",
    "footer.dev": "Developed by",

    "explorer.eyebrow": "Catalogue",
    "explorer.title": "Explore talents",
    "explorer.count": "{n} profile matching your search.",
    "explorer.countPlural": "{n} profiles matching your search.",
    "explorer.countNote":
      "Sponsored profiles are marked; free artists always remain visible in results.",
    "explorer.q": "Search a name, a pseudonym or a specialty",
    "explorer.search": "Search",
    "explorer.filters": "Filters",
    "explorer.reset": "Reset",
    "explorer.country": "Country",
    "explorer.city": "City",
    "explorer.category": "Category",
    "explorer.specialty": "Specialty",
    "explorer.specialtyPh": "e.g. documentary portrait",
    "explorer.availability": "Availability",
    "explorer.allCountries": "All countries",
    "explorer.allCities": "All cities",
    "explorer.allCats": "All disciplines",
    "explorer.all": "All",
    "explorer.apply": "Apply",
    "explorer.proOnly": "Pro and Premium profiles only",
    "explorer.empty": "No talent matches yet.",
    "explorer.emptyText": "Broaden your criteria or explore every discipline.",
    "explorer.resetFilters": "Reset filters",
    "explorer.sort.relevance": "Relevance",
    "explorer.sort.recent": "Most recent",
    "explorer.sort.popular": "Most viewed",
    "explorer.closeFilters": "Close filters",

    "avail.available": "Available for projects",
    "avail.open_to_collab": "Open to collaborations",
    "avail.busy": "Fully booked",

    "cats.eyebrow": "Disciplines",
    "cats.title": "All categories",
    "cats.text":
      "Fifteen families of practice, from documentary portrait to digital art. Pick a discipline to discover the creators who bring it to life.",

    "pricing.eyebrow": "Plans",
    "pricing.title": "Three plans, one goal: your visibility.",
    "pricing.text":
      "No commission on your sales. Prices are in US dollars. Portfolio limits are applied automatically.",
    "pricing.boost.eyebrow": "Boost a profile",
    "pricing.boost.title": "Timed features",
    "pricing.boost.text":
      "Appear at the top of the home page, search results and category pages. The “Sponsored” badge keeps it transparent.",
    "pricing.boost.cta": "Boost my profile",
    "pricing.faq": "Frequently asked questions",
    "pricing.faq1q": "Can I stay on the free plan?",
    "pricing.faq1a":
      "Yes. The Starter plan is free with no time limit: public profile, 5 photos, contact requests and presence in search results.",
    "pricing.faq2q": "How does payment work?",
    "pricing.faq2a":
      "You choose your plan from your space: a request is created with its amount. It is activated as soon as payment is confirmed. Nothing is ever charged automatically without your explicit consent.",
    "pricing.faq3q": "Do free artists stay visible?",
    "pricing.faq3a":
      "Yes. Ranking favours complete and active profiles, and boosted profiles are clearly labelled as sponsored. A free profile is never hidden.",
    "pricing.faq4q": "What happens when I reach my portfolio limit?",
    "pricing.faq4a":
      "The limit is applied automatically: your portfolio shows the number of media included in your plan. You can upgrade at any time.",
    "pricing.faq5q": "Can I cancel?",
    "pricing.faq5a":
      "Yes, at any time. Your profile returns to the Starter plan at the end of the current period, without losing content beyond the Starter limit.",

    "plan.mostChosen": "Most chosen",
    "plan.perMonth": "/ month",
    "plan.start": "Start for free",
    "plan.choose": "Choose {name}",

    "artist.sponsored": "Sponsored",

    "common.loading": "Loading…",
    "common.save": "Save",
    "common.cancel": "Cancel",
  },
  es,
  pt,
  sw,
};

export const LANGUAGES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "sw", label: "SW" },
];

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);