// Helpers partagés par les pages du journal.
export function excerptOf(post, max = 170) {
  const raw = post.excerpt || post.content || "";
  const flat = raw.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max).replace(/[.,;:\s]+$/, "")}…` : flat;
}

export function readMinutes(post) {
  return Math.max(2, Math.round(((post.content || "").split(/\s+/).length || 0) / 220));
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function postUrl(slug) {
  return `/actualites/${slug}`;
}