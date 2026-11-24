// Contenu de départ de la page Explorer : catégories et quelques profils d'artistes ILLUSTRATIFS, chacun avec une œuvre.
// Ces profils sont marqués `is_demo` : ils portent la mention « Profil d'exemple », n'ont aucune coordonnée, ne sont pas
// contactables, ne sont pas indexés par les moteurs de recherche et se suppriment en un clic depuis Superadmin > Import.
// Photos libres de droits Unsplash, les mêmes que celles déjà utilisées par le site.
const photo = (id, width = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const EXPLORE_CATEGORIES = [
  ["Photographie", "photographie", "camera"],
  ["Peinture", "peinture", "palette"],
  ["Sculpture", "sculpture", "sculpture"],
  ["Illustration", "illustration", "pen"],
  ["Musique", "musique", "music"],
  ["Mode", "mode", "shirt"],
  ["Cinéma", "cinema", "film"],
  ["Vidéo", "video", "video"],
  ["Design graphique", "design-graphique", "monitor"],
  ["Artisanat", "artisanat", "hammer"],
  ["Bijoux", "bijoux", "gem"],
  ["Danse", "danse", "music"],
  ["Architecture", "architecture", "building"],
  ["Art numérique", "art-numerique", "sparkles"],
].map(([name, slug, icon], i) => ({ id: `demo-cat-${slug}`, name, slug, icon, sort: i, active: true }));

const NOTE = "Profil d'exemple, créé pour montrer à quoi ressemble une page d'artiste sur Afrik Art : présentation, disciplines et portfolio. Les artistes réels ouvrent la leur gratuitement.";

const ARTISTS = [
  { slug: "amina-diallo", name: "Amina Diallo", category: "Photographie", country: "Sénégal", city: "Dakar", tagline: "Photographe documentaire", specialty: "Portrait de rue", image: "1518998053901-5348d3961a04", work: ["Portrait de rue", "Photographie"] },
  { slug: "kwame-mensah", name: "Kwame Mensah", category: "Peinture", country: "Ghana", city: "Accra", tagline: "Peintre de la couleur et de la mémoire", specialty: "Peinture contemporaine", image: "1541961017774-22349e4a1262", work: ["Mémoire en couleurs", "Peinture"] },
  { slug: "zola-nkosi", name: "Zola Nkosi", category: "Mode", country: "Afrique du Sud", city: "Le Cap", tagline: "Créatrice de mode et de textiles", specialty: "Textile et prêt-à-porter", image: "1523381210434-271e8be1f52b", work: ["Textile en série limitée", "Mode"] },
  { slug: "ibrahim-sow", name: "Ibrahim Sow", category: "Musique", country: "Côte d'Ivoire", city: "Abidjan", tagline: "Musicien et compositeur", specialty: "Scène et composition", image: "1516450360452-9312f5e86fc7", work: ["Session live", "Musique"] },
  { slug: "fatima-zahra", name: "Fatima Zahra", category: "Art numérique", country: "Maroc", city: "Casablanca", tagline: "Artiste numérique et illustratrice", specialty: "Art génératif", image: "1579783902614-a3fb3927b6a5", work: ["Étude de couleur", "Art numérique"] },
];

export const EXPLORE_ARTISTS = ARTISTS.map((a) => ({
  id: `demo-${a.slug}`,
  user_id: "demo",
  display_name: a.name,
  slug: a.slug,
  tagline: a.tagline,
  bio: `${NOTE}`,
  country: a.country,
  city: a.city,
  primary_category: a.category,
  categories: [a.category],
  specialty: a.specialty,
  availability: "available",
  avatar_url: photo(a.image, 400),
  cover_url: photo(a.image, 1600),
  accepting_contact: false,
  notify_email: false,
  notify_whatsapp: false,
  is_published: true,
  plan: "starter",
  plan_status: "active",
  verified: false,
  status: "active",
  views: 0,
  is_demo: true,
}));

export const EXPLORE_ARTWORKS = ARTISTS.map((a, i) => ({
  id: `demo-art-${a.slug}`,
  profile_id: `demo-${a.slug}`,
  owner_user_id: "demo",
  title: `${a.work[0]} (exemple)`,
  description: "Œuvre d'exemple, présentée pour illustrer un portfolio sur Afrik Art.",
  media_type: "photo",
  image_url: photo(a.image, 1400),
  category: a.work[1],
  year: "2026",
  sort: i,
}));
