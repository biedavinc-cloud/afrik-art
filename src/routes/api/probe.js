import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/probe")({
  server: {
    handlers: {
      GET: async ({ context }) => {
        try {
          const res = await context
            .getBase44()
            .entities.PlanConfig.list({ sort: "sort", limit: 20 });
          return Response.json({ ok: true, res });
        } catch (error) {
          return Response.json({
            ok: false,
            message: error?.message,
            stack: String(error?.stack || "").split("\n").slice(0, 6),
          });
        }
      },
    },
  },
});