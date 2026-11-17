// Écosystème Liafrik : source unique des produits présentés sur le site (bloc d'accueil, page /ecosysteme,
// données structurées, articles du journal). Les descriptions reprennent les fiches officielles de
// https://liafrik.com — ne rien y ajouter qui ne figure pas sur ces fiches ou qui n'ait été confirmé par Liafrik.
// Textes en français et en anglais ; les autres langues du site affichent l'anglais.

export const LIAFRIK = {
  name: "Liafrik",
  legalName: "Liaffrik Tech",
  url: "https://liafrik.com",
  catalog: "https://liafrik.com/en/products",
  logo: "/ecosystem/liafrik-logo.png",
  icon: "/ecosystem/liafrik-icon.png",
  tagline: { fr: "Racines africaines · Vision mondiale · Bâtir l'avenir", en: "African roots · Global vision · Building the future" },
  presence: {
    fr: [
      { k: "Siège", v: "Dubaï" },
      { k: "En Afrique", v: "Yaoundé" },
      { k: "Couverture", v: "Toute l'Afrique" },
    ],
    en: [
      { k: "Head office", v: "Dubai" },
      { k: "In Africa", v: "Yaoundé" },
      { k: "Coverage", v: "All of Africa" },
    ],
  },
};

// Fiche officielle d'un produit sur liafrik.com
const sheet = (slug) => `https://liafrik.com/en/products/${slug}`;

export const GROUPS = {
  commerce: { fr: "Commerce", en: "Commerce" },
  restaurant: { fr: "Restauration", en: "Restaurants" },
  education: { fr: "Éducation", en: "Education" },
  health: { fr: "Santé", en: "Healthcare" },
  beauty: { fr: "Beauté & bien-être", en: "Beauty & wellness" },
  business: { fr: "Gestion d'entreprise", en: "Business management" },
};

export const PRODUCTS = [
  {
    id: "zanldo",
    name: "Zanldo",
    group: "commerce",
    url: "https://zanldo.com",
    sheet: sheet("zanldo"),
    logo: "/ecosystem/zanldo.png",
    cover: "/ecosystem/covers/zanldo.jpg",
    accent: "#FF8C1A",
    label: { fr: "Marketplace", en: "Marketplace" },
    alt: { fr: "L'alternative africaine à Amazon et Noon", en: "The African alternative to Amazon and Noon" },
    tagline: { fr: "La marketplace de toute l'Afrique.", en: "The marketplace for all of Africa." },
    text: {
      fr: "Téléphones, mode, électronique, maison, beauté, épicerie, art et artisanat : des vendeurs vérifiés, un paiement sécurisé par Mobile Money ou carte, une livraison suivie et des prix en monnaie locale (XOF).",
      en: "Phones, fashion, electronics, home, beauty, groceries, art and crafts: verified sellers, secure payment by Mobile Money or card, tracked delivery and prices in local currency (XOF).",
    },
    features: {
      fr: ["Vendeurs vérifiés", "Paiement Mobile Money et carte", "Livraison suivie", "Petites commissions pour les vendeurs"],
      en: ["Verified sellers", "Mobile Money and card payment", "Tracked delivery", "Small commissions for sellers"],
    },
  },
  {
    id: "sukulu",
    name: "Sukulu",
    group: "education",
    url: "https://gosukulu.com",
    sheet: sheet("sukulu"),
    logo: "/ecosystem/sukulu.png",
    cover: "/ecosystem/covers/sukulu.jpg",
    accent: "#0A8FA3",
    label: { fr: "Gestion scolaire", en: "School management" },
    alt: { fr: "La plateforme pour numériser les établissements scolaires", en: "The platform that digitizes schools" },
    tagline: { fr: "Toute l'école sur une seule plateforme.", en: "The whole school on one platform." },
    text: {
      fr: "Un système complet qui relie administrateurs, enseignants, élèves et parents : dossiers élèves, classes et emplois du temps, examens et notes, finances de l'école et portail parents.",
      en: "A complete system connecting administrators, teachers, students and parents: student records, classes and timetables, exams and grading, school finance and a parent portal.",
    },
    features: {
      fr: ["Dossiers élèves et enseignants", "Examens et notes automatisés", "Suivi des frais de scolarité", "Portail parents"],
      en: ["Student and teacher records", "Automated exams and grading", "Fee collection tracking", "Parent portal"],
    },
  },
  {
    id: "health",
    name: "Health",
    group: "health",
    url: sheet("health"),
    sheet: sheet("health"),
    logo: "/ecosystem/health.png",
    cover: "/ecosystem/covers/health.jpg",
    accent: "#E8365D",
    label: { fr: "Gestion hospitalière", en: "Hospital management" },
    alt: { fr: "Health Cloud : la gestion des hôpitaux et des cliniques", en: "Health Cloud: hospital and clinic management" },
    tagline: { fr: "De l'admission au dossier médical.", en: "From admission to medical record." },
    text: {
      fr: "Pilotez votre hôpital ou votre clinique : patients, rendez-vous, dossiers et historique médicaux, facturation et assurances, pharmacie, avec un tableau de bord hospitalier.",
      en: "Run your hospital or clinic: patients, appointments, medical records and history, billing and insurance, pharmacy, with a hospital dashboard.",
    },
    features: {
      fr: ["Dossiers patients", "Prise de rendez-vous", "Facturation et assurances", "Gestion de la pharmacie"],
      en: ["Patient records", "Appointment scheduling", "Billing and insurance", "Pharmacy management"],
    },
  },
  {
    id: "stella",
    name: "Stella",
    group: "beauty",
    url: sheet("stella"),
    sheet: sheet("stella"),
    logo: "/ecosystem/stella.png",
    cover: "/ecosystem/covers/stella.jpg",
    accent: "#6E4BFF",
    label: { fr: "Réservation beauté", en: "Beauty booking" },
    alt: { fr: "L'alternative à Fresha", en: "The Fresha alternative" },
    tagline: { fr: "Réservez beauté et bien-être en quelques secondes.", en: "Book beauty and wellness in seconds." },
    text: {
      fr: "Coiffure, tresses, barbier, ongles, massage, soins du visage : disponibilités en temps réel, acompte par Mobile Money pour sécuriser le créneau, rappels WhatsApp automatiques. En français et en anglais.",
      en: "Hair, braids, barbers, nails, massage, facial care: real-time availability, a Mobile Money deposit to secure the slot, automatic WhatsApp reminders. In English and French.",
    },
    features: {
      fr: ["Disponibilités en temps réel", "Acompte Mobile Money", "Rappels WhatsApp", "Salons, barbiers, ongleries, spas"],
      en: ["Real-time availability", "Mobile Money deposit", "WhatsApp reminders", "Salons, barbershops, nail studios, spas"],
    },
  },
  {
    id: "pos",
    name: "POS Flow",
    group: "commerce",
    url: sheet("pos"),
    sheet: sheet("pos"),
    logo: "/ecosystem/pos.png",
    cover: "/ecosystem/covers/pos.jpg",
    accent: "#1250AE",
    label: { fr: "Caisse & commerce de détail", en: "Retail POS" },
    alt: { fr: "L'alternative à Square", en: "The Square alternative" },
    tagline: { fr: "La caisse qui clôture la journée d'une touche.", en: "The register that closes the day in one tap." },
    text: {
      fr: "Gérez votre magasin, suivez vos stocks, encaissez et lisez vos ventes en temps réel depuis une seule caisse. Mode hors ligne avec synchronisation automatique, plusieurs boutiques, paiements carte et mobile.",
      en: "Run your store, track inventory, accept payments and read your sales in real time from a single point of sale. Offline mode with auto-sync, multi-branch support, card and mobile payments.",
    },
    features: {
      fr: ["Ventes en temps réel", "Stocks intelligents", "Mode hors ligne", "Multi-boutiques"],
      en: ["Real-time sales", "Smart inventory", "Offline mode", "Multi-branch"],
    },
  },
  {
    id: "sellia",
    name: "Sellia",
    group: "commerce",
    url: sheet("sellia"),
    sheet: sheet("sellia"),
    logo: "/ecosystem/sellia.png",
    cover: "/ecosystem/covers/sellia.jpg",
    accent: "#00785A",
    label: { fr: "Boutique en ligne", en: "Online store" },
    alt: { fr: "L'alternative à Shopify", en: "The Shopify alternative" },
    tagline: { fr: "Lancez votre boutique en ligne.", en: "Launch your online store." },
    text: {
      fr: "Créateur de boutique, commandes, comptes clients, catalogue produits, passerelles de paiement et intégrations de livraison : tout le commerce en ligne, au même endroit.",
      en: "Storefront builder, orders, customer accounts, product catalog, payment gateways and shipping integrations: all of online commerce in one place.",
    },
    features: {
      fr: ["Créateur de boutique", "Catalogue et commandes", "Paiements centralisés", "Paiement mobile en priorité"],
      en: ["Storefront builder", "Catalog and orders", "All payments in one place", "Mobile-first checkout"],
    },
  },
  {
    id: "nutro",
    name: "Nutro",
    group: "restaurant",
    url: sheet("nutro"),
    sheet: sheet("nutro"),
    logo: null,
    cover: "/ecosystem/covers/nutro.jpg",
    accent: "#1D1D1D",
    label: { fr: "Gestion de restaurant", en: "Restaurant management" },
    alt: { fr: "L'alternative à Toast", en: "The Toast alternative" },
    tagline: { fr: "La technologie des restaurants d'exception.", en: "Technology for exceptional restaurants." },
    text: {
      fr: "Menus numériques, plats, ingrédients et informations nutritionnelles, commandes, écran cuisine, tables, stocks et recettes, menu et commande par QR code, planning du personnel : une plateforme premium pour restaurants, cafés, chaînes et hôtels.",
      en: "Digital menus, dishes, ingredients and nutrition information, orders, kitchen display, tables, inventory and recipes, QR menu and ordering, staff scheduling: a premium platform for restaurants, cafés, chains and hotels.",
    },
    features: {
      fr: ["Écran cuisine", "Menu et commande par QR", "Stocks et recettes", "Plusieurs établissements"],
      en: ["Kitchen display", "QR menu and ordering", "Inventory and recipes", "Multiple outlets"],
    },
  },
  {
    id: "atlas",
    name: "Atlas CRM",
    group: "business",
    url: sheet("atlas"),
    sheet: sheet("atlas"),
    logo: "/ecosystem/atlas.png",
    cover: "/ecosystem/covers/atlas.jpg",
    accent: "#061A3A",
    label: { fr: "CRM d'entreprise", en: "Enterprise CRM" },
    alt: { fr: "L'alternative à Salesforce", en: "The Salesforce alternative" },
    tagline: { fr: "Le CRM des groupes et des franchises.", en: "The CRM for groups and franchises." },
    text: {
      fr: "Chaque client, filiale ou marque dispose de son propre espace strictement isolé : une seule plateforme, aucune fuite de données entre locataires. Rôles par espace, pipeline unifié, workflows automatisés, journaux d'audit.",
      en: "Every client, branch or brand gets its own strictly isolated workspace: one platform, zero data leakage between tenants. Per-tenant roles, unified pipeline, automated workflows, audit logs.",
    },
    features: {
      fr: ["Isolation stricte des données", "Rôles et permissions par espace", "Pipeline multi-marques", "Journaux d'audit"],
      en: ["Strict data isolation", "Per-tenant roles and permissions", "Multi-brand pipeline", "Audit logs"],
    },
  },
  {
    id: "libooks",
    name: "LiBooks",
    group: "business",
    url: sheet("libooks"),
    sheet: sheet("libooks"),
    logo: null,
    cover: "/ecosystem/covers/libooks.jpg",
    accent: "#1D1D1D",
    label: { fr: "Comptabilité", en: "Accounting" },
    alt: { fr: "L'alternative à QuickBooks", en: "The QuickBooks alternative" },
    tagline: { fr: "Une comptabilité aux normes OHADA et SYSCOHADA.", en: "Accounting built for OHADA and SYSCOHADA standards." },
    text: {
      fr: "Facturation, comptabilité en partie double, rapports financiers et conformité fiscale, dans le respect des normes OHADA et SYSCOHADA : restez prêt pour l'audit et suivez votre trésorerie en direct.",
      en: "Invoicing, double-entry accounting, financial reports and tax compliance, aligned with OHADA and SYSCOHADA standards: stay audit-ready and track your cash flow live.",
    },
    features: {
      fr: ["Facturation automatisée", "Comptabilité en partie double", "Rapports financiers", "Conformité fiscale"],
      en: ["Automated invoicing", "Double-entry accounting", "Financial reports", "Tax compliance"],
    },
  },
];

// Autres produits du catalogue officiel (fiches sur liafrik.com).
export const MORE_PRODUCTS = [
  ["crm", "CRM"],
  ["faka", "Faka"],
  ["bailly", "Bailly"],
  ["kolo", "Kolo"],
  ["skills", "Skills"],
  ["mafo", "Mafo"],
  ["litrek", "Litrek"],
  ["hostrek", "Hostrek"],
  ["zexpress", "Zexpress"],
  ["nkapo", "Nkapo"],
  ["id", "ID"],
].map(([slug, name]) => ({ id: slug, name, url: sheet(slug) }));

// Sélection mise en avant sur la page d'accueil.
export const HOME_PRODUCT_IDS = ["zanldo", "sukulu", "health", "stella", "pos", "sellia", "nutro", "atlas"];

export const pick = (value, lang) => (value && typeof value === "object" && !Array.isArray(value) && ("fr" in value || "en" in value) ? (lang === "fr" ? value.fr : value.en) : value);
