import { getSessionUser, inviteUser } from "./auth.server";
import { createEntities } from "./data.server";
import { HttpError } from "./errors";
import { sendMail } from "./mail.server";

/**
 * Client « serveur » de l'application, passé aux fonctions serveur via `context.getApi()` :
 *   api.entities.X.*             avec les droits du visiteur de la requête (règles RLS appliquées)
 *   api.asServiceRole.entities.X accès interne complet — après avoir authentifié l'appelant
 *   api.auth.me()                utilisateur connecté, ou erreur 401
 */
export function createServerApi(request) {
  let userPromise;
  const loadUser = () => (userPromise ??= getSessionUser(request));

  const integrations = {
    Core: {
      async SendEmail({ to, subject, html, text }) {
        if (!(await sendMail({ to, subject, html, text }))) throw new Error("E-mail non envoyé.");
        return { ok: true };
      },
    },
  };

  return {
    entities: createEntities({ service: false, browser: false, user: null, load: loadUser }),
    auth: {
      async me() {
        const user = await loadUser();
        if (!user) throw new HttpError(401, "Authentification requise.");
        return user;
      },
    },
    integrations,
    asServiceRole: {
      entities: createEntities({ service: true, browser: false, user: null }),
      users: { inviteUser: (email, role) => inviteUser(request, email, role) },
      integrations,
    },
  };
}
