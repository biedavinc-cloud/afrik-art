// Client navigateur de l'application : même forme d'appels que côté serveur
// (api.entities.X.filter(...), api.auth.login(...)), traduits en requêtes vers /api/*.
// Les règles d'accès sont appliquées par le serveur ; ce fichier n'a aucun pouvoir par lui-même.

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = "POST", body, form } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers: body !== undefined ? { "content-type": "application/json" } : undefined,
      body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
  } catch {
    throw new ApiError("Connexion impossible. Vérifiez votre réseau et réessayez.", 0);
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // réponse sans corps JSON
  }
  if (!response.ok) throw new ApiError(payload?.error?.message || `Erreur ${response.status}`, response.status, payload?.error?.code);
  return payload;
}

const entityClients = new Map();

function entityClient(entity) {
  const call = (op) => async (...args) => (await request("/api/db", { body: { entity, op, args } })).result;
  return {
    list: call("list"),
    filter: call("filter"),
    get: call("get"),
    create: call("create"),
    update: call("update"),
    delete: call("delete"),
    count: call("count"),
    updateMany: call("updateMany"),
  };
}

export const api = {
  entities: new Proxy(
    {},
    {
      get(_, name) {
        if (typeof name !== "string") return undefined;
        if (!entityClients.has(name)) entityClients.set(name, entityClient(name));
        return entityClients.get(name);
      },
    },
  ),

  auth: {
    me: async () => (await request("/api/auth/me", { method: "GET" })).user,
    options: () => request("/api/auth/options", { method: "GET" }),
    register: (payload) => request("/api/auth/register", { body: payload }),
    verifyOtp: ({ email, otpCode }) => request("/api/auth/verify-otp", { body: { email, otpCode } }),
    resendOtp: (email) => request("/api/auth/resend-otp", { body: { email } }),
    login: (email, password) => request("/api/auth/login", { body: { email, password } }),
    logout: () => request("/api/auth/logout", { body: {} }),
    resetPasswordRequest: (email) => request("/api/auth/reset-password-request", { body: { email } }),
    resetPassword: ({ resetToken, newPassword }) => request("/api/auth/reset-password", { body: { resetToken, newPassword } }),
    // Navigation complète : le serveur redirige ensuite vers returnTo (chemin interne uniquement).
    loginWithGoogle: (returnTo = "/") => window.location.assign(`/api/auth/google-start?returnTo=${encodeURIComponent(returnTo)}`),
    redirectToLogin: (returnTo = "/") => window.location.assign(`/login?returnTo=${encodeURIComponent(returnTo)}`),
  },

  integrations: {
    Core: {
      // Envoie une image vers R2 ; renvoie { file_url }.
      async UploadPublicFile({ file }) {
        const form = new FormData();
        form.append("file", file);
        return request("/api/files/upload", { form });
      },
    },
  },
};
