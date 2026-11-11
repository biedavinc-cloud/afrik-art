import { env } from "cloudflare:workers";
import { HttpError } from "./errors";
import { ensureSchema } from "./schema.server";
import { newId } from "./security.server";

// Entité « User » : table des comptes. Les secrets (mot de passe, sub Google) ne sortent jamais d'ici.
const FILTERABLE = new Set(["id", "email", "full_name", "role", "created_date", "updated_date", "email_verified"]);
const FIELD_OK = /^[a-z_]+$/;

export const publicUser = (row) =>
  row && {
    id: row.id,
    email: row.email,
    full_name: row.full_name ?? null,
    role: row.role,
    avatar_url: row.avatar_url ?? null,
    email_verified: Boolean(row.email_verified),
    created_date: row.created_date,
    updated_date: row.updated_date,
  };

export const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

export const superadminEmails = () =>
  new Set(String(env.SUPERADMIN_EMAILS ?? "").split(/[,;\s]+/).map(normalizeEmail).filter(Boolean));

const orderBy = (sort) => {
  const raw = typeof sort === "string" && sort.trim() ? sort.trim() : "-created_date";
  const field = raw.replace(/^[-+]/, "");
  if (!FILTERABLE.has(field)) throw new HttpError(400, "Tri non pris en charge.");
  return `${field} ${raw.startsWith("-") ? "DESC" : "ASC"}, id ASC`;
};

export function createUsersApi(ctx) {
  const db = () => env.DB;
  const isAdmin = () => ctx.service || ctx.user?.role === "admin";
  async function prepare() {
    await ensureSchema();
    if (ctx.load) {
      const load = ctx.load;
      ctx.load = null;
      ctx.user = await load();
    }
  }

  async function filter(query = {}, a, b) {
    await prepare();
    if (!ctx.service && !ctx.user) throw new HttpError(401, "Authentification requise.");
    const opts = a && typeof a === "object" ? a : { sort: a, limit: b };
    const limit = Math.min(Math.max(parseInt(opts.limit ?? 500, 10) || 500, 1), 5000);
    const where = [];
    const params = [];
    for (const [field, value] of Object.entries(query ?? {})) {
      if (value === undefined) continue;
      if (!FIELD_OK.test(field) || !FILTERABLE.has(field)) throw new HttpError(400, "Filtre non pris en charge.");
      where.push(`${field} = ?`);
      params.push(typeof value === "boolean" ? Number(value) : value);
    }
    // Un utilisateur ordinaire ne voit que son propre compte.
    if (!isAdmin()) {
      where.push("id = ?");
      params.push(ctx.user.id);
    }
    const sql = `SELECT * FROM users ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${orderBy(opts.sort)} LIMIT ?`;
    const { results } = await db().prepare(sql).bind(...params, limit).all();
    return results.map(publicUser);
  }

  async function get(id) {
    await prepare();
    if (!ctx.service && !ctx.user) throw new HttpError(401, "Authentification requise.");
    if (!isAdmin() && id !== ctx.user.id) throw new HttpError(403, "Accès refusé.");
    const row = await db().prepare("SELECT * FROM users WHERE id = ?").bind(String(id)).first();
    if (!row) throw new HttpError(404, "Utilisateur introuvable.");
    return publicUser(row);
  }

  return {
    filter,
    list: (a, b) => filter({}, a, b),
    get,

    async count(query) {
      return (await filter(query, { limit: 5000 })).length;
    },

    async create(input) {
      if (!ctx.service) throw new HttpError(403, "Accès refusé.");
      await prepare();
      const email = normalizeEmail(input?.email);
      if (!email) throw new HttpError(422, "Adresse e-mail obligatoire.");
      const now = new Date().toISOString();
      const id = newId();
      await db()
        .prepare("INSERT INTO users (id, email, full_name, role, email_verified, created_date, updated_date) VALUES (?,?,?,?,0,?,?)")
        .bind(id, email, input.full_name ?? null, input.role === "admin" ? "admin" : "user", now, now)
        .run();
      return get(id);
    },

    async update(id, patch) {
      await prepare();
      const target = await get(id); // vérifie l'accès (soi-même ou admin)
      const changes = {};
      for (const key of ["full_name", "avatar_url"]) if (typeof patch?.[key] === "string") changes[key] = patch[key].slice(0, 300);
      if (patch?.role !== undefined) {
        if (!ctx.service) throw new HttpError(403, "Le rôle ne peut être modifié que par le serveur.");
        if (!["admin", "user"].includes(patch.role)) throw new HttpError(422, "Rôle invalide.");
        changes.role = patch.role;
      }
      const keys = Object.keys(changes);
      if (keys.length === 0) return target;
      await db()
        .prepare(`UPDATE users SET ${keys.map((k) => `${k} = ?`).join(", ")}, updated_date = ? WHERE id = ?`)
        .bind(...keys.map((k) => changes[k]), new Date().toISOString(), id)
        .run();
      return get(id);
    },

    async delete(id) {
      if (!ctx.service) throw new HttpError(403, "Accès refusé.");
      await prepare();
      await db().batch([
        db().prepare("DELETE FROM sessions WHERE user_id = ?").bind(id),
        db().prepare("DELETE FROM users WHERE id = ?").bind(id),
      ]);
      return { success: true };
    },
  };
}
