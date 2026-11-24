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
// Point de cadrage d'une couverture, lu dans son adresse (?pos=100%25%2010%25 → « 100% 10% »). Permet aux visuels de marque
// de garder leur logo visible quand le bandeau est recadré (mobile, bandeau large). Sans indication : centré.
export function coverPosition(url) {
  try {
    const value = new URL(url, "https://example.org").searchParams.get("pos");
    return value && /^\d{1,3}%\s\d{1,3}%$/.test(value) ? value : undefined;
  } catch {
    return undefined;
  }
}
