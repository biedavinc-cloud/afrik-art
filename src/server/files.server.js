import { env } from "cloudflare:workers";
import { clientIp, getSessionUser, throttle } from "./auth.server";
import { HttpError } from "./errors";
import { randomHex } from "./security.server";

// Fichiers publics (images du portfolio, avatars, couvertures) dans R2.
const MAX_BYTES = 10 * 1024 * 1024;

// Le type est déterminé par le CONTENU du fichier, jamais par le nom ni l'en-tête envoyés (pas de SVG : il peut contenir du script).
function sniff(bytes) {
  const startsWith = (...sig) => sig.every((b, i) => b === null || bytes[i] === b);
  if (startsWith(0xff, 0xd8, 0xff)) return { type: "image/jpeg", ext: "jpg" };
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { type: "image/png", ext: "png" };
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return { type: "image/gif", ext: "gif" };
  if (startsWith(0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50)) return { type: "image/webp", ext: "webp" };
  if (startsWith(null, null, null, null, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66)) return { type: "image/avif", ext: "avif" };
  return null;
}

export async function uploadFile(request) {
  const user = await getSessionUser(request);
  if (!user) throw new HttpError(401, "Authentification requise.");
  if (!env.FILES) throw new HttpError(503, "Le stockage de fichiers n'est pas configuré.");
  await throttle(`upload:${user.id}`, 120, 3600);
  await throttle(`upload-ip:${clientIp(request)}`, 240, 3600);

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BYTES + 100_000) throw new HttpError(413, "Fichier trop volumineux (10 Mo maximum).");
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") throw new HttpError(400, "Aucun fichier reçu.");
  if (file.size > MAX_BYTES) throw new HttpError(413, "Fichier trop volumineux (10 Mo maximum).");

  const buffer = await file.arrayBuffer();
  const kind = sniff(new Uint8Array(buffer.slice(0, 16)));
  if (!kind) throw new HttpError(415, "Format non pris en charge (JPEG, PNG, WebP, GIF ou AVIF).");

  const key = `uploads/${user.id}/${randomHex(12)}.${kind.ext}`;
  await env.FILES.put(key, buffer, { httpMetadata: { contentType: kind.type } });
  const base = env.PUBLIC_URL || new URL(request.url).origin;
  return { file_url: `${base}/files/${key}` };
}

export async function serveFile(request, key) {
  if (!env.FILES) return new Response("Not found", { status: 404 });
  if (!/^uploads\/[A-Za-z0-9_-]{1,64}\/[A-Za-z0-9_-]{1,64}\.[a-z0-9]{2,5}$/.test(key || "")) return new Response("Not found", { status: 404 });
  const object = await env.FILES.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers({
    "content-type": object.httpMetadata?.contentType || "application/octet-stream",
    "cache-control": "public, max-age=31536000, immutable",
    etag: object.httpEtag,
    "x-content-type-options": "nosniff",
    "content-security-policy": "default-src 'none'; sandbox",
    "cross-origin-resource-policy": "cross-origin",
  });
  if (request.headers.get("if-none-match") === object.httpEtag) return new Response(null, { status: 304, headers });
  return new Response(request.method === "HEAD" ? null : object.body, { headers });
}
