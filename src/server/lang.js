// Langues de la plateforme (mêmes codes que src/lib/dictionaries.js).
export const LANGS = ["fr", "en", "es", "pt", "sw"];

/** Langue à utiliser : celle demandée par le navigateur si elle est prise en charge, sinon Accept-Language, sinon français. */
export function pickLang(candidate, request) {
  const wanted = String(candidate ?? "").slice(0, 2).toLowerCase();
  if (LANGS.includes(wanted)) return wanted;
  for (const part of (request?.headers?.get("accept-language") || "").split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (LANGS.includes(code)) return code;
  }
  return "fr";
}
