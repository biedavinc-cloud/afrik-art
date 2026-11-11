// Erreur HTTP typée : le statut et le message arrivent tels quels jusqu'au navigateur.
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

export function errorResponse(error) {
  if (error instanceof HttpError) {
    const headers = error.retryAfter ? { "retry-after": String(error.retryAfter) } : {};
    return json({ error: { message: error.message, code: error.code } }, error.status, headers);
  }
  console.error("[api] erreur interne:", error?.stack || error);
  return json({ error: { message: "Erreur interne du serveur." } }, 500);
}
