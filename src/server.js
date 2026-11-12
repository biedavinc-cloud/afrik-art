// Point d'entrée du Worker : le gestionnaire standard de TanStack Start. Les erreurs de chargement
// d'une page sont écrites dans les logs Cloudflare (Workers > Observabilité) ; le visiteur reçoit la même réponse.
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const handler = createStartHandler((ctx) => {
  for (const match of ctx.router.state.matches) {
    if (match.status === "error") {
      console.error(`[route] ${match.routeId} :`, match.error?.stack || match.error);
    }
  }
  return defaultStreamHandler(ctx);
});

// En-têtes de sécurité ajoutés à toutes les réponses : pas d'affichage du site dans une page tierce
// (clickjacking), pas de détection de type hasardeuse, adresse d'origine limitée dans les liens sortants, HTTPS imposé.
const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
};

export default {
  async fetch(request, env, ctx) {
    const response = await handler(request, env, ctx);
    const secured = new Response(response.body, response);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!secured.headers.has(name)) secured.headers.set(name, value);
    }
    return secured;
  },
};
