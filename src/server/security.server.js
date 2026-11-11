// Primitives cryptographiques (WebCrypto uniquement : aucune dépendance).
const enc = new TextEncoder();

export const toHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

export const randomHex = (byteLength = 16) => toHex(crypto.getRandomValues(new Uint8Array(byteLength)));

export const newId = () => randomHex(12); // 24 caractères hexadécimaux

export async function sha256Hex(text) {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

// Comparaison en temps constant de deux chaînes de même nature (hex).
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Code à N chiffres, tirage uniforme (pas de biais de modulo).
export function randomDigits(length = 6) {
  let out = "";
  const limit = 256 - (256 % 10);
  while (out.length < length) {
    const [byte] = crypto.getRandomValues(new Uint8Array(1));
    if (byte < limit) out += String(byte % 10);
  }
  return out;
}

// Mot de passe : PBKDF2-SHA256. 100 000 itérations = le maximum accepté par le runtime Workers.
const PBKDF2_ITERATIONS = 100_000;

async function derive(password, saltBytes, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations }, key, 256));
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${await derive(password, salt, PBKDF2_ITERATIONS)}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iterations, saltHex, hashHex] = String(stored || "").split("$");
  if (scheme !== "pbkdf2" || !saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return safeEqual(await derive(password, salt, Number(iterations)), hashHex);
}
