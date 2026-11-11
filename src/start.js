import { createStart } from "@tanstack/react-start";
import { apiRequestMiddleware, authMiddleware, csrfMiddleware } from "@/lib/auth-middleware";

// Chaque fonction serveur et chaque route serveur reçoit `context.getApi()`, avec les droits du visiteur.
// Le contrôle CSRF passe en premier.
export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, apiRequestMiddleware],
  functionMiddleware: [authMiddleware],
}));
