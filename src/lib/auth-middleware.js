import { createMiddleware } from "@tanstack/react-start";
import { getRequest, setResponseStatus } from "@tanstack/react-start/server";
import { createServerApi } from "@/server/api.server";
import { assertSameOrigin } from "@/server/csrf";

// Chaque fonction serveur et chaque route serveur reçoit `context.getApi()` : une fonction, pas le client,
// pour qu'un handler qui ne touche pas aux données ne paie aucune lecture de session. La session
// (cookie HttpOnly) est résolue à la première utilisation ; les règles d'accès s'appliquent alors au visiteur.
const withGetApi = (next, request = getRequest()) => {
  let api;
  return next({ context: { getApi: () => (api ??= createServerApi(request)) } });
};

// Appliqué à toutes les fonctions serveur par src/start.js.
export const authMiddleware = createMiddleware({ type: "function" }).server(({ next }) => withGetApi(next));

// Appliqué à toutes les requêtes par src/start.js : les routes serveur (`server.handlers`) reçoivent le même `context.getApi()`.
export const apiRequestMiddleware = createMiddleware({ type: "request" }).server(({ next, request }) => withGetApi(next, request));

// Protection CSRF : toute requête qui modifie l'état doit venir de ce site (voir src/server/csrf.js).
export const csrfMiddleware = createMiddleware({ type: "request" }).server(({ next, request }) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    try {
      assertSameOrigin(request);
    } catch (error) {
      return Response.json({ error: { message: error.message } }, { status: 403 });
    }
  }
  return next();
});

// Seul un refus d'authentification signifie « non connecté » ; une panne se propage telle quelle.
const currentUser = (context) =>
  context
    .getApi()
    .auth.me()
    .catch((error) => {
      if (error?.status === 401 || error?.status === 403) return null;
      throw error;
    });

// À ajouter à une fonction serveur qui exige un utilisateur connecté ; renseigne `context.user` :
//   createServerFn().middleware([requireUser]).handler(({ context }) => context.user.id)
export const requireUser = createMiddleware({ type: "function" }).server(async ({ next, context }) => {
  const user = await currentUser(context);
  if (!user) {
    setResponseStatus(401);
    throw Object.assign(new Error("Unauthorized"), { status: 401, code: "UNAUTHORIZED" });
  }
  return next({ context: { user } });
});

// Équivalent pour une route serveur : répond 401 aux anonymes et renseigne `context.user`.
export const requireUserRoute = createMiddleware({ type: "request" }).server(async ({ next, context }) => {
  const user = await currentUser(context);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return next({ context: { user } });
});
