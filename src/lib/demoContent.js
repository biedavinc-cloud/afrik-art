// Données d'exemple locales (affichées tant que la base n'est pas alimentée).
// Elles seront remplacées par les artistes réels de la plateforme.
export const demoCategories = [
  { name: "Photographie", slug: "photographie", icon: "camera" },
  { name: "Peinture", slug: "peinture", icon: "palette" },
  { name: "Sculpture", slug: "sculpture", icon: "sculpture" },
  { name: "Illustration", slug: "illustration", icon: "pen" },
  { name: "Musique", slug: "musique", icon: "music" },
  { name: "Mode", slug: "mode", icon: "shirt" },
  { name: "Cinéma", slug: "cinema", icon: "film" },
  { name: "Vidéo", slug: "video", icon: "video" },
  { name: "Design graphique", slug: "design-graphique", icon: "monitor" },
  { name: "Artisanat", slug: "artisanat", icon: "hammer" },
  { name: "Bijoux", slug: "bijoux", icon: "gem" },
  { name: "Danse", slug: "danse", icon: "music" },
  { name: "Architecture", slug: "architecture", icon: "building" },
  { name: "Art numérique", slug: "art-numerique", icon: "sparkles" },
];

export const demoArtists = [
  {
    id: "demo-1",
    slug: "amina-diallo",
    display_name: "Amina Diallo",
    primary_category: "Photographie",
    country: "Sénégal",
    city: "Dakar",
    plan: "premium",
    boosted: true,
    verified: true,
    tagline: "Portraits documentaires de la jeunesse sahélienne.",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-2",
    slug: "kwame-mensah",
    display_name: "Kwame Mensah",
    primary_category: "Peinture",
    country: "Ghana",
    city: "Accra",
    plan: "pro",
    boosted: false,
    verified: true,
    tagline: "Peintures à l'huile entre mémoire et abstraction.",
    avatar_url:
      "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-3",
    slug: "zola-nkosi",
    display_name: "Zola Nkosi",
    primary_category: "Mode",
    country: "Afrique du Sud",
    city: "Johannesburg",
    plan: "premium",
    boosted: true,
    verified: true,
    tagline: "Textiles contemporains tissés en série limitée.",
    avatar_url:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-4",
    slug: "ibrahim-sow",
    display_name: "Ibrahim Sow",
    primary_category: "Musique",
    country: "Mali",
    city: "Bamako",
    plan: "starter",
    boosted: false,
    verified: false,
    tagline: "Kora, électronique et spoken word.",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-5",
    slug: "fatima-zahra",
    display_name: "Fatima Zahra",
    primary_category: "Art numérique",
    country: "Maroc",
    city: "Casablanca",
    plan: "pro",
    boosted: false,
    verified: true,
    tagline: "Génératif, calligraphie et volumes 3D.",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-6",
    slug: "tendai-moyo",
    display_name: "Tendai Moyo",
    primary_category: "Sculpture",
    country: "Zimbabwe",
    city: "Harare",
    plan: "starter",
    boosted: false,
    verified: false,
    tagline: "Pierre de Springstone, formes organiques.",
    avatar_url:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
  },
];

export const demoCountries = [
  { name: "Sénégal", city: "Dakar" },
  { name: "Nigeria", city: "Lagos" },
  { name: "Ghana", city: "Accra" },
  { name: "Kenya", city: "Nairobi" },
  { name: "Afrique du Sud", city: "Le Cap" },
  { name: "Maroc", city: "Casablanca" },
  { name: "Côte d'Ivoire", city: "Abidjan" },
  { name: "Éthiopie", city: "Addis-Abeba" },
];