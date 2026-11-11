import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/server/errors";
import { health } from "@/server/schema.server";

// Contrôle de santé : vérifie que D1 répond et que le schéma est en place.
export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return json({ ok: true, ...(await health()) });
        } catch {
          return json({ ok: false }, 503);
        }
      },
    },
  },
});
