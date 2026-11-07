// Modération automatique des contenus publiés (blog).
// Le lexique est volontairement court et ciblé : stupéfiants, violence,
// exploitation, fraude. La comparaison ignore accents, casse et ponctuation.
const STEMS = [
  // Stupéfiants et trafics
  "drogu",
  "cocaine",
  "heroine",
  "cannabis",
  "marijuana",
  "ecstasy",
  "ecsta",
  "mdma",
  "amphetamin",
  "methamphetamin",
  "ketamine",
  "fentanyl",
  "opium",
  "stupefiant",
  "narcotraf",
  "dealeur",
  "crack",
  "shabu",
  "crystal meth",
  // Violence, haine, terrorisme
  "terroris",
  "djihad",
  "jihad",
  "attentat",
  "kalachnikov",
  "genocid",
  "massacr",
  "meurtre",
  "assassin",
  "tuerie",
  "egorg",
  "nazi",
  "hitler",
  "suicid",
  "automutilation",
  "zoophil",
  "inceste",
  "pedophil",
  // Exploitation sexuelle
  "prostitu",
  "pornograph",
  "porno",
  "onlyfans",
  "camgirl",
  "maison close",
  // Fraude et illégal
  "arnaque",
  "escroquer",
  "escroc",
  "phishing",
  "hameconnage",
  "contrefacon",
  "ponzi",
  "blanchiment",
  "blanchis",
  "faux billets",
  "faux papiers",
];

const WORDS = ["viol", "deal", "shit", "lsd", "xxx", "escort", "cartel", "braquage"];

function normalize(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[_*#>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Renvoie la liste des thèmes détectés (vide si le texte est propre).
export function scanText(text) {
  const haystack = normalize(text);
  if (!haystack) return [];
  const hits = new Set();

  for (const stem of STEMS) {
    const pattern = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(stem)}[a-z0-9]*`, "g");
    if (haystack.match(pattern)) hits.add(stem);
  }
  for (const word of WORDS) {
    const pattern = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(word)}(?=[^a-z0-9]|$)`, "g");
    if (haystack.match(pattern)) hits.add(word);
  }
  return [...hits];
}

// Retourne un message d'erreur explicite, ou null si le contenu est conforme.
export function moderationMessage(hits) {
  if (!hits.length) return null;
  const sample = hits.slice(0, 4).join(", ");
  return `Publication bloquée : ce texte contient des termes contraires aux règles de la communauté (${sample}). Reformulez sans allusion aux drogues, à la violence, à l'exploitation ou à la fraude.`;
}