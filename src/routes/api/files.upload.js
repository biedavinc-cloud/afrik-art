import { createFileRoute } from "@tanstack/react-router";
import { assertSameOrigin } from "@/server/csrf";
import { errorResponse, json } from "@/server/errors";
import { uploadFile } from "@/server/files.server";

export const Route = createFileRoute("/api/files/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          assertSameOrigin(request);
          return json(await uploadFile(request));
        } catch (error) {
          return errorResponse(error);
        }
      },
    },
  },
});
