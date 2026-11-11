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

export default { fetch: handler };
