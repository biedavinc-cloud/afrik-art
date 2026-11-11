import { createFileRoute } from "@tanstack/react-router";
import { serveFile } from "@/server/files.server";

// Sert les fichiers publics stockés dans R2 : /files/uploads/<compte>/<fichier>
export const Route = createFileRoute("/files/$")({
  server: {
    handlers: {
      GET: ({ request, params }) => serveFile(request, params._splat),
      HEAD: ({ request, params }) => serveFile(request, params._splat),
    },
  },
});
