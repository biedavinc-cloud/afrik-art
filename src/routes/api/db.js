import { createFileRoute } from "@tanstack/react-router";
import { clientIp, getSessionUser, throttle } from "@/server/auth.server";
import { assertSameOrigin } from "@/server/csrf";
import { createEntities } from "@/server/data.server";
import { HttpError, errorResponse, json } from "@/server/errors";

// Point d'entrée unique des données pour le navigateur : { entity, op, args } → { result }.
// Les règles d'accès (RLS) et la politique « navigateur » sont appliquées par le moteur, côté serveur.
const OPS = new Set(["list", "filter", "get", "create", "update", "delete", "count", "updateMany"]);
const MAX_BODY = 1_000_000;

export const Route = createFileRoute("/api/db")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          assertSameOrigin(request);
          const length = Number(request.headers.get("content-length") || 0);
          if (length > MAX_BODY) throw new HttpError(413, "Requête trop volumineuse.");
          const body = await request.json().catch(() => null);
          if (!body || typeof body.entity !== "string" || !OPS.has(body.op)) throw new HttpError(400, "Requête invalide.");
          const args = Array.isArray(body.args) ? body.args.slice(0, 5) : [];

          const userPromise = getSessionUser(request);
          // Les créations anonymes autorisées (contact, signalement, support) sont limitées par adresse IP.
          if (body.op === "create" && !(await userPromise)) await throttle(`anon-create:${clientIp(request)}`, 30, 3600);

          const entities = createEntities({ service: false, browser: true, user: null, load: () => userPromise });
          const result = await entities[body.entity][body.op](...args);
          return json({ result });
        } catch (error) {
          return errorResponse(error);
        }
      },
    },
  },
});
