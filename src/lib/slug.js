export function slugify(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function makeSlug(name) {
  const base = slugify(name) || "artiste";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export const COUNTRIES = [
  "Algérie", "Angola", "Bénin", "Botswana", "Burkina Faso", "Burundi", "Cameroun",
  "Cap-Vert", "Centrafrique", "Comores", "Congo", "Côte d'Ivoire", "Djibouti", "Égypte",
  "Érythrée", "Eswatini", "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée",
  "Guinée-Bissau", "Guinée équatoriale", "Kenya", "Lesotho", "Liberia", "Libye",
  "Madagascar", "Malawi", "Mali", "Maroc", "Maurice", "Mauritanie", "Mozambique",
  "Namibie", "Niger", "Nigeria", "Ouganda", "Rwanda", "Sao Tomé-et-Principe",
  "Sénégal", "Seychelles", "Sierra Leone", "Somalie", "Soudan", "Soudan du Sud",
  "Afrique du Sud", "Tanzanie", "Tchad", "Togo", "Tunisie", "Zambie", "Zimbabwe",
  "Autre pays",
];