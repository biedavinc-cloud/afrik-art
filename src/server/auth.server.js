import { env } from "cloudflare:workers";
import { HttpError } from "./errors";
import { otpEmail, resetEmail, sendMail } from "./mail.server";
import { ensureSchema } from "./schema.server";
import { hashPassword, newId, randomDigits, randomHex, safeEqual, sha256Hex, verifyPassword } from "./security.server";
import { normalizeEmail, publicUser, superadminEmails } from "./users.server";

/**
 * Authentification propre à l'application, 100 % Cloudflare :
 *  - comptes dans D1, mots de passe PBKDF2-SHA256 ;
 *  - session = jeton aléatoire dans un cookie HttpOnly (seul son hash SHA-256 est stocké) ;
 *  - vérification d'e-mail par code à 6 chiffres, réinitialisation par lien à usage unique ;
 *  - connexion Google (OAuth 2.0) si GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET sont définis.
 */

export const SESSION_COOKIE = "aa_session";
const OAUTH_COOKIE = "aa_oauth";
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
const OTP_TTL_MS = 15 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;
const INVITE_TTL_MS = 7 * 24 * 3600 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const db = () => env.DB;

// ---------- Cookies ----------

export function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

function buildCookie(request, name, value, { maxAge, path = "/" }) {
  const secure = new URL(request.url).protocol === "https:";
  return `${name}=${encodeURIComponent(value)}; Path=${path}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export const sessionCookie = (request, token) => buildCookie(request, SESSION_COOKIE, token, { maxAge: SESSION_TTL_MS / 1000 });
export const clearSessionCookie = (request) => buildCookie(request, SESSION_COOKIE, "", { maxAge: 0 });

export const clientIp = (request) => request.headers.get("cf-connecting-ip") || "unknown";

// ---------- Limitation de débit ----------

export async function throttle(key, limit, windowSeconds) {
  await ensureSchema();
  const now = Date.now();
  const resetAt = now + windowSeconds * 1000;
  const row = await db()
    .prepare(
      `INSERT INTO throttle (key, count, reset_at) VALUES (?, 1, ?)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN reset_at <= ? THEN 1 ELSE count + 1 END,
         reset_at = CASE WHEN reset_at <= ? THEN ? ELSE reset_at END
       RETURNING count, reset_at`,
    )
    .bind(key, resetAt, now, now, resetAt)
    .first();
  if (row.count > limit) {
    const error = new HttpError(429, "Trop de tentatives. Réessayez dans quelques minutes.", "rate_limited");
    error.retryAfter = Math.max(1, Math.ceil((row.reset_at - now) / 1000));
    throw error;
  }
}

// ---------- Sessions ----------

async function createSession(userId) {
  const token = randomHex(32);
  const now = Date.now();
  await db()
    .prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?,?,?,?)")
    .bind(await sha256Hex(token), userId, now, now + SESSION_TTL_MS)
    .run();
  // Ménage opportuniste des sessions et codes expirés.
  await db().batch([
    db().prepare("DELETE FROM sessions WHERE expires_at < ?").bind(now),
    db().prepare("DELETE FROM auth_codes WHERE expires_at < ?").bind(now),
    db().prepare("DELETE FROM throttle WHERE reset_at < ?").bind(now),
  ]);
  return token;
}

/** Utilisateur de la requête (cookie de session), ou null. */
export async function getSessionUser(request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  await ensureSchema();
  const row = await db()
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(await sha256Hex(token), Date.now())
    .first();
  return row ? publicUser(row) : null;
}

// ---------- Comptes ----------

const userByEmail = (email) => db().prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

// Les super administrateurs déclarés (SUPERADMIN_EMAILS) reçoivent le rôle admin dès que leur e-mail est vérifié.
async function applyBootstrapRole(row) {
  if (row.email_verified && row.role !== "admin" && superadminEmails().has(row.email)) {
    await db().prepare("UPDATE users SET role = 'admin', updated_date = ? WHERE id = ?").bind(new Date().toISOString(), row.id).run();
    return { ...row, role: "admin" };
  }
  return row;
}

async function startSession(request, row) {
  const fresh = await applyBootstrapRole(row);
  const token = await createSession(fresh.id);
  return { user: publicUser(fresh), setCookie: sessionCookie(request, token) };
}

function validateEmail(raw) {
  const email = normalizeEmail(raw);
  if (!EMAIL_RE.test(email) || email.length > 254) throw new HttpError(422, "Adresse e-mail invalide.");
  return email;
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 8) throw new HttpError(422, "Le mot de passe doit contenir au moins 8 caractères.");
  if (password.length > 200) throw new HttpError(422, "Mot de passe trop long.");
  return password;
}

async function issueOtp(email, userId) {
  await throttle(`otp-send:${email}`, 5, 3600);
  const code = randomDigits(6);
  const now = Date.now();
  await db()
    .prepare(
      `INSERT INTO auth_codes (purpose, key, code_hash, user_id, attempts, created_at, expires_at) VALUES ('otp', ?, ?, ?, 0, ?, ?)
       ON CONFLICT(purpose, key) DO UPDATE SET code_hash = excluded.code_hash, user_id = excluded.user_id, attempts = 0, created_at = excluded.created_at, expires_at = excluded.expires_at`,
    )
    .bind(email, await sha256Hex(`${code}:${email}`), userId, now, now + OTP_TTL_MS)
    .run();
  const mail = otpEmail(code);
  await sendMail({ to: email, ...mail });
}

export async function register(request, { email: rawEmail, password: rawPassword, full_name }) {
  await ensureSchema();
  await throttle(`register:${clientIp(request)}`, 20, 3600);
  const email = validateEmail(rawEmail);
  const password = validatePassword(rawPassword);
  const existing = await userByEmail(email);
  if (existing?.email_verified && existing.password_hash) {
    throw new HttpError(409, "Un compte existe déjà avec cette adresse e-mail. Connectez-vous.", "account_exists");
  }
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  let userId = existing?.id;
  if (existing) {
    // Compte non vérifié (ou invité) : le dernier mot de passe saisi gagne, mais rien n'est actif tant que l'e-mail n'est pas confirmé.
    await db().prepare("UPDATE users SET password_hash = ?, full_name = COALESCE(?, full_name), updated_date = ? WHERE id = ?").bind(passwordHash, full_name?.slice(0, 120) ?? null, now, existing.id).run();
  } else {
    userId = newId();
    await db()
      .prepare("INSERT INTO users (id, email, full_name, role, password_hash, email_verified, created_date, updated_date) VALUES (?,?,?,?,?,0,?,?)")
      .bind(userId, email, full_name?.slice(0, 120) ?? null, "user", passwordHash, now, now)
      .run();
  }
  await issueOtp(email, userId);
  return { ok: true };
}

export async function resendOtp(request, { email: rawEmail }) {
  await ensureSchema();
  const email = validateEmail(rawEmail);
  const user = await userByEmail(email);
  if (user?.email_verified && user.password_hash) throw new HttpError(400, "Email already verified");
  if (user) await issueOtp(email, user.id);
  return { ok: true }; // même réponse si le compte n'existe pas
}

export async function verifyOtp(request, { email: rawEmail, otpCode }) {
  await ensureSchema();
  const email = validateEmail(rawEmail);
  const code = String(otpCode ?? "").replace(/\s+/g, "");
  const user = await userByEmail(email);
  const row = await db().prepare("SELECT * FROM auth_codes WHERE purpose = 'otp' AND key = ?").bind(email).first();
  if (!row || row.expires_at < Date.now() || !user) {
    if (user?.email_verified) throw new HttpError(400, "Email already verified");
    throw new HttpError(400, "Code invalide ou expiré. Demandez un nouveau code.");
  }
  if (row.attempts >= MAX_OTP_ATTEMPTS) {
    await db().prepare("DELETE FROM auth_codes WHERE purpose = 'otp' AND key = ?").bind(email).run();
    throw new HttpError(400, "Trop d'essais. Demandez un nouveau code.");
  }
  const ok = /^\d{6}$/.test(code) && safeEqual(await sha256Hex(`${code}:${email}`), row.code_hash);
  if (!ok) {
    await db().prepare("UPDATE auth_codes SET attempts = attempts + 1 WHERE purpose = 'otp' AND key = ?").bind(email).run();
    throw new HttpError(400, "Code de vérification invalide.");
  }
  await db().batch([
    db().prepare("DELETE FROM auth_codes WHERE purpose = 'otp' AND key = ?").bind(email),
    db().prepare("UPDATE users SET email_verified = 1, updated_date = ? WHERE id = ?").bind(new Date().toISOString(), user.id),
  ]);
  return startSession(request, { ...user, email_verified: 1 });
}

// Hash factice pour que « compte inconnu » et « mauvais mot de passe » prennent le même temps.
const DUMMY_HASH = `pbkdf2$100000$${"00".repeat(16)}$${"00".repeat(32)}`;

export async function login(request, { email: rawEmail, password }) {
  await ensureSchema();
  const email = normalizeEmail(rawEmail);
  await throttle(`login-ip:${clientIp(request)}`, 40, 900);
  await throttle(`login:${email}`, 8, 900);
  const user = EMAIL_RE.test(email) ? await userByEmail(email) : null;
  const valid = await verifyPassword(String(password ?? ""), user?.password_hash || DUMMY_HASH);
  if (!user || !user.password_hash || !valid) throw new HttpError(401, "Adresse e-mail ou mot de passe incorrect.", "invalid_credentials");
  if (!user.email_verified) {
    await issueOtp(email, user.id).catch(() => {});
    throw new HttpError(403, "Adresse e-mail non vérifiée. Un nouveau code vient de vous être envoyé : terminez l'inscription.", "email_not_verified");
  }
  await db().prepare("DELETE FROM throttle WHERE key = ?").bind(`login:${email}`).run();
  return startSession(request, user);
}

export async function logout(request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    await ensureSchema();
    await db().prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
  }
}

// ---------- Réinitialisation / invitation ----------

const originOf = (request) => env.PUBLIC_URL || new URL(request.url).origin;

async function sendPasswordLink(request, user, { invited, ttl }) {
  const token = randomHex(32);
  const now = Date.now();
  await db()
    .prepare(
      `INSERT INTO auth_codes (purpose, key, code_hash, user_id, attempts, created_at, expires_at) VALUES ('reset', ?, ?, ?, 0, ?, ?)
       ON CONFLICT(purpose, key) DO UPDATE SET code_hash = excluded.code_hash, created_at = excluded.created_at, expires_at = excluded.expires_at`,
    )
    .bind(user.id, await sha256Hex(token), user.id, now, now + ttl)
    .run();
  const link = `${originOf(request)}/reset-password?token=${token}`;
  return sendMail({ to: user.email, ...resetEmail(link, { invited }) });
}

export async function requestPasswordReset(request, { email: rawEmail }) {
  await ensureSchema();
  const email = normalizeEmail(rawEmail);
  if (!EMAIL_RE.test(email)) return { ok: true };
  await throttle(`reset:${email}`, 5, 3600);
  await throttle(`reset-ip:${clientIp(request)}`, 20, 3600);
  const user = await userByEmail(email);
  if (user) await sendPasswordLink(request, user, { invited: false, ttl: RESET_TTL_MS });
  return { ok: true }; // identique que le compte existe ou non
}

export async function resetPassword(request, { resetToken, newPassword }) {
  await ensureSchema();
  await throttle(`reset-use:${clientIp(request)}`, 20, 3600);
  const password = validatePassword(newPassword);
  const token = String(resetToken ?? "");
  if (!/^[a-f0-9]{64}$/.test(token)) throw new HttpError(400, "Lien invalide ou expiré.");
  const row = await db()
    .prepare("SELECT * FROM auth_codes WHERE purpose = 'reset' AND code_hash = ? AND expires_at > ?")
    .bind(await sha256Hex(token), Date.now())
    .first();
  if (!row) throw new HttpError(400, "Lien invalide ou expiré.");
  // Avoir reçu le lien prouve la possession de l'e-mail : le compte devient vérifié.
  await db().batch([
    db().prepare("UPDATE users SET password_hash = ?, email_verified = 1, updated_date = ? WHERE id = ?").bind(await hashPassword(password), new Date().toISOString(), row.user_id),
    db().prepare("DELETE FROM sessions WHERE user_id = ?").bind(row.user_id),
    db().prepare("DELETE FROM auth_codes WHERE purpose = 'reset' AND key = ?").bind(row.key),
  ]);
  return { ok: true };
}

/** Invitation d'un compte (réservé au code serveur) : crée le compte s'il manque et envoie le lien d'activation. */
export async function inviteUser(request, email, role = "user") {
  await ensureSchema();
  const clean = validateEmail(email);
  const wanted = role === "admin" ? "admin" : "user";
  let user = await userByEmail(clean);
  const now = new Date().toISOString();
  if (user) {
    if (user.role !== wanted) await db().prepare("UPDATE users SET role = ?, updated_date = ? WHERE id = ?").bind(wanted, now, user.id).run();
  } else {
    const id = newId();
    await db().prepare("INSERT INTO users (id, email, role, email_verified, created_date, updated_date) VALUES (?,?,?,0,?,?)").bind(id, clean, wanted, now, now).run();
    user = { id, email: clean };
  }
  await sendPasswordLink(request, user, { invited: true, ttl: INVITE_TTL_MS });
  return { ok: true };
}

// ---------- Google OAuth 2.0 ----------

export const googleConfigured = () => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);

// Destination après connexion : chemin interne uniquement (jamais de redirection ouverte).
export function safePath(raw) {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.length > 500) return "/";
  return raw;
}

const callbackUrl = (request) => `${new URL(request.url).origin}/api/auth/google-callback`;

function redirect(location, cookies = []) {
  const headers = new Headers({ location, "cache-control": "no-store" });
  for (const c of cookies) headers.append("set-cookie", c);
  return new Response(null, { status: 302, headers });
}

export function googleStart(request) {
  const url = new URL(request.url);
  if (!googleConfigured()) return redirect("/login?error=google_unavailable");
  const state = randomHex(16);
  const returnTo = safePath(url.searchParams.get("returnTo"));
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl(request),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, [
    buildCookie(request, OAUTH_COOKIE, `${state}|${returnTo}`, { maxAge: 600, path: "/api/auth" }),
  ]);
}

export async function googleCallback(request) {
  const url = new URL(request.url);
  const clearOauth = buildCookie(request, OAUTH_COOKIE, "", { maxAge: 0, path: "/api/auth" });
  const fail = () => redirect("/login?error=google_failed", [clearOauth]);
  try {
    if (!googleConfigured()) return fail();
    const [state, returnTo] = String(readCookie(request, OAUTH_COOKIE) || "").split("|");
    const code = url.searchParams.get("code");
    if (!state || !code || !safeEqual(state, url.searchParams.get("state") || "")) return fail();

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl(request),
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return fail();
    const { access_token } = await tokenRes.json();
    const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${access_token}` } });
    if (!infoRes.ok) return fail();
    const info = await infoRes.json();
    const email = normalizeEmail(info.email);
    if (!info.sub || !EMAIL_RE.test(email) || info.email_verified !== true) return fail();

    await ensureSchema();
    const now = new Date().toISOString();
    let user = (await db().prepare("SELECT * FROM users WHERE google_sub = ?").bind(info.sub).first()) || (await userByEmail(email));
    if (user) {
      await db()
        .prepare("UPDATE users SET google_sub = ?, email_verified = 1, full_name = COALESCE(full_name, ?), avatar_url = COALESCE(avatar_url, ?), updated_date = ? WHERE id = ?")
        .bind(info.sub, info.name ?? null, info.picture ?? null, now, user.id)
        .run();
      user = { ...user, email_verified: 1 };
    } else {
      const id = newId();
      await db()
        .prepare("INSERT INTO users (id, email, full_name, role, email_verified, google_sub, avatar_url, created_date, updated_date) VALUES (?,?,?,?,1,?,?,?,?)")
        .bind(id, email, info.name ?? null, "user", info.sub, info.picture ?? null, now, now)
        .run();
      user = { id, email, role: "user", email_verified: 1 };
    }
    const { setCookie } = await startSession(request, user);
    return redirect(safePath(returnTo), [setCookie, clearOauth]);
  } catch (error) {
    console.error("[auth] Google callback:", error?.message || error);
    return fail();
  }
}
