import { createFileRoute } from "@tanstack/react-router";
import * as auth from "@/server/auth.server";
import { assertSameOrigin } from "@/server/csrf";
import { HttpError, errorResponse, json } from "@/server/errors";

const withCookie = (data, setCookie, status = 200) => json(data, status, setCookie ? { "set-cookie": setCookie } : {});

const POST_ACTIONS = {
  async register(request, body) {
    return json(await auth.register(request, body));
  },
  async "verify-otp"(request, body) {
    const { user, setCookie } = await auth.verifyOtp(request, body);
    return withCookie({ user }, setCookie);
  },
  async "resend-otp"(request, body) {
    return json(await auth.resendOtp(request, body));
  },
  async login(request, body) {
    const { user, setCookie } = await auth.login(request, body);
    return withCookie({ user }, setCookie);
  },
  async logout(request) {
    await auth.logout(request);
    return withCookie({ ok: true }, auth.clearSessionCookie(request));
  },
  async "reset-password-request"(request, body) {
    return json(await auth.requestPasswordReset(request, body));
  },
  async "reset-password"(request, body) {
    return json(await auth.resetPassword(request, body));
  },
};

export const Route = createFileRoute("/api/auth/$action")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          switch (params.action) {
            case "me": {
              const user = await auth.getSessionUser(request);
              if (!user) throw new HttpError(401, "Authentification requise.");
              return json({ user });
            }
            case "options":
              return json({ google: auth.googleConfigured() });
            case "google-start":
              return auth.googleStart(request);
            case "google-callback":
              return await auth.googleCallback(request);
            default:
              throw new HttpError(404, "Route inconnue.");
          }
        } catch (error) {
          return errorResponse(error);
        }
      },
      POST: async ({ request, params }) => {
        try {
          assertSameOrigin(request);
          const handler = POST_ACTIONS[params.action];
          if (!handler) throw new HttpError(404, "Route inconnue.");
          const length = Number(request.headers.get("content-length") || 0);
          if (length > 20_000) throw new HttpError(413, "Requête trop volumineuse.");
          const body = await request.json().catch(() => ({}));
          return await handler(request, body ?? {});
        } catch (error) {
          return errorResponse(error);
        }
      },
    },
  },
});
