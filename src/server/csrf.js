import { HttpError } from "./errors";

// Protection CSRF des requêtes qui modifient l'état : le navigateur indique lui-même d'où part la requête.
// Cookie SameSite=Lax + ce contrôle = une page tierce ne peut pas agir au nom d'un visiteur connecté.
export function assertSameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") throw new HttpError(403, "Requête refusée (origine inattendue).");
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, "Requête refusée (origine inattendue).");
}
