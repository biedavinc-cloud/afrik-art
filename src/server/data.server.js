import { env } from "cloudflare:workers";
import { ADMIN_ONLY, BROWSER_BLOCKED, ENTITIES, PRIVATE_FIELDS, PROTECTED_FIELDS, UNIQUE_FIELDS, ruleFor } from "./entities";
import { HttpError } from "./errors";
import { ensureSchema } from "./schema.server";
import { newId, randomHex } from "./security.server";
import { createUsersApi } from "./users.server";

/**
 * Moteur d'entités sur D1 : même API que celle qu'utilisait l'application
 * (list / filter / get / create / update / delete / count / updateMany) et mêmes règles d'accès (RLS)
 * déclarées dans src/server/entities/*.json, appliquées ici, côté serveur.
 *
 * Contexte d'appel :
 *   user      l'utilisateur connecté (ou null)
 *   service   true = accès interne complet, sans RLS (réservé au code serveur)
 *   browser   true = appel venu du navigateur via /api/db : politique supplémentaire (BROWSER_BLOCKED)
 */

const COLUMNS = new Set(["id", "created_date", "updated_date", "created_by", "created_by_id"]);
const FIELD_RE = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 5000;
const MAX_RECORD_BYTES = 900_000;

const TRUE = { sql: "1=1", params: [] };
const FALSE = { sql: "0=1", params: [] };
const and = (parts) =>
  parts.length === 0
    ? TRUE
    : { sql: parts.map((p) => `(${p.sql})`).join(" AND "), params: parts.flatMap((p) => p.params) };
const or = (parts) =>
  parts.length === 0
    ? FALSE
    : { sql: parts.map((p) => `(${p.sql})`).join(" OR "), params: parts.flatMap((p) => p.params) };

// ---------- Outils de requête ----------

// Les noms de champs sont interpolés dans le SQL : on n'accepte que des identifiants sûrs.
function fieldExpr(field) {
  if (!FIELD_RE.test(field)) throw new HttpError(400, `Nom de champ invalide : ${String(field).slice(0, 40)}`);
  return COLUMNS.has(field) ? field : `json_extract(data, '$.${field}')`;
}

function bind(value) {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" || typeof value === "number") return value;
  throw new HttpError(400, "Valeur de filtre invalide.");
}

function compileQuery(query) {
  const parts = [];
  for (const [field, cond] of Object.entries(query ?? {})) {
    if (cond === undefined) continue;
    const expr = fieldExpr(field);
    if (cond === null) {
      parts.push({ sql: `${expr} IS NULL`, params: [] });
    } else if (Array.isArray(cond)) {
      parts.push(inList(expr, cond));
    } else if (typeof cond === "object" && !(cond instanceof Date)) {
      for (const [op, v] of Object.entries(cond)) {
        if (op === "$in") parts.push(inList(expr, v));
        else if (op === "$ne") parts.push({ sql: `${expr} IS NOT ?`, params: [v === null ? null : bind(v)] });
        else if (op === "$gt") parts.push({ sql: `${expr} > ?`, params: [bind(v)] });
        else if (op === "$gte") parts.push({ sql: `${expr} >= ?`, params: [bind(v)] });
        else if (op === "$lt") parts.push({ sql: `${expr} < ?`, params: [bind(v)] });
        else if (op === "$lte") parts.push({ sql: `${expr} <= ?`, params: [bind(v)] });
        else throw new HttpError(400, `Opérateur de filtre non pris en charge : ${op}`);
      }
    } else {
      parts.push({ sql: `${expr} = ?`, params: [bind(cond)] });
    }
  }
  return and(parts);
}

function inList(expr, list) {
  if (!Array.isArray(list)) throw new HttpError(400, "$in attend une liste.");
  if (list.length === 0) return FALSE;
  if (list.length > 200) throw new HttpError(400, "Liste de filtre trop longue.");
  return { sql: `${expr} IN (${list.map(() => "?").join(",")})`, params: list.map(bind) };
}

export function compileSort(sort) {
  const raw = typeof sort === "string" && sort.trim() ? sort.trim() : "-created_date";
  const desc = raw.startsWith("-");
  const field = raw.replace(/^[-+]/, "");
  return `${fieldExpr(field)} ${desc ? "DESC" : "ASC"}, id ASC`;
}

export function normalizeOptions(a, b, c) {
  const opts = a && typeof a === "object" ? { sort: a.sort, limit: a.limit, skip: a.skip ?? a.offset } : { sort: a, limit: b, skip: c };
  const limit = Math.min(Math.max(parseInt(opts.limit ?? DEFAULT_LIMIT, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = Math.max(parseInt(opts.skip ?? 0, 10) || 0, 0);
  return { sort: opts.sort, limit, skip };
}

// ---------- Règles d'accès (RLS) ----------

function resolveTemplate(value, user) {
  if (typeof value === "string" && value.startsWith("{{") && value.endsWith("}}")) {
    const path = value.slice(2, -2).trim();
    if (!path.startsWith("user.")) return undefined;
    return user?.[path.slice(5)] ?? undefined;
  }
  return value;
}

const userCondition = (cond, user) => Boolean(user) && Object.entries(cond).every(([k, v]) => user[k] === v);

// Règle → fragment SQL (lectures en liste, comptages, updateMany).
export function compileRule(rule, user) {
  if (!rule || Object.keys(rule).length === 0) return TRUE;
  const parts = [];
  for (const [key, value] of Object.entries(rule)) {
    if (key === "$or") parts.push(or(value.map((r) => compileRule(r, user))));
    else if (key === "$and") parts.push(and(value.map((r) => compileRule(r, user))));
    else if (key === "user_condition") parts.push(userCondition(value, user) ? TRUE : FALSE);
    else {
      const resolved = resolveTemplate(value, user);
      if (resolved === undefined) parts.push(FALSE);
      else parts.push({ sql: `${fieldExpr(key.startsWith("data.") ? key.slice(5) : key)} = ?`, params: [bind(resolved)] });
    }
  }
  return and(parts);
}

// Même règle évaluée sur un enregistrement déjà chargé (get / update / delete / create).
export function evalRule(rule, user, row) {
  if (!rule || Object.keys(rule).length === 0) return true;
  return Object.entries(rule).every(([key, value]) => {
    if (key === "$or") return value.some((r) => evalRule(r, user, row));
    if (key === "$and") return value.every((r) => evalRule(r, user, row));
    if (key === "user_condition") return userCondition(value, user);
    const resolved = resolveTemplate(value, user);
    if (resolved === undefined) return false;
    return row[key.startsWith("data.") ? key.slice(5) : key] === resolved;
  });
}

// ---------- Validation ----------

function coerce(name, spec, value) {
  switch (spec.type) {
    case "string":
      if (typeof value !== "string") throw new HttpError(422, `Le champ « ${name} » doit être un texte.`);
      return value;
    case "number": {
      const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
      if (typeof n !== "number" || !Number.isFinite(n)) throw new HttpError(422, `Le champ « ${name} » doit être un nombre.`);
      return n;
    }
    case "integer": {
      const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
      if (!Number.isInteger(n)) throw new HttpError(422, `Le champ « ${name} » doit être un entier.`);
      return n;
    }
    case "boolean":
      if (value === "true") return true;
      if (value === "false") return false;
      if (typeof value !== "boolean") throw new HttpError(422, `Le champ « ${name} » doit être vrai ou faux.`);
      return value;
    case "array":
      if (!Array.isArray(value)) throw new HttpError(422, `Le champ « ${name} » doit être une liste.`);
      return value;
    case "object":
      if (typeof value !== "object" || Array.isArray(value)) throw new HttpError(422, `Le champ « ${name} » doit être un objet.`);
      return value;
    default:
      return value;
  }
}

// Valide et normalise les champs fournis ; une chaîne vide sur un champ à valeurs imposées = « non renseigné ».
function cleanFields(def, input) {
  const out = {};
  for (const [name, raw] of Object.entries(input)) {
    const spec = def.properties?.[name];
    if (raw === undefined) continue;
    if (!spec) {
      out[name] = raw; // champ libre : accepté tel quel
      continue;
    }
    if (raw === null) {
      out[name] = null;
      continue;
    }
    if (raw === "" && spec.enum) continue;
    const value = coerce(name, spec, raw);
    if (spec.enum && !spec.enum.includes(value)) {
      throw new HttpError(422, `Valeur invalide pour « ${name} » (attendu : ${spec.enum.join(", ")}).`);
    }
    out[name] = value;
  }
  return out;
}

function withDefaults(def, fields) {
  const out = { ...fields };
  for (const [name, spec] of Object.entries(def.properties ?? {})) {
    if (out[name] === undefined && spec.default !== undefined) out[name] = spec.default;
  }
  return out;
}

function assertRequired(def, fields) {
  for (const name of def.required ?? []) {
    const v = fields[name];
    if (v === undefined || v === null || v === "") throw new HttpError(422, `Le champ « ${name} » est obligatoire.`);
  }
}

// ---------- Accès aux données ----------

const db = () => env.DB;
const isAdmin = (ctx) => ctx.user?.role === "admin";

// Schéma appliqué + utilisateur de la requête résolu (une seule fois, à la première opération qui en a besoin).
async function prepare(ctx) {
  await ensureSchema();
  if (ctx.load) {
    const load = ctx.load;
    ctx.load = null;
    ctx.user = await load();
  }
}

function entityDef(name) {
  const def = ENTITIES[name];
  if (!def) throw new HttpError(404, `Entité inconnue : ${String(name).slice(0, 40)}`);
  return def;
}

function hydrate(row) {
  return {
    id: row.id,
    created_date: row.created_date,
    updated_date: row.updated_date,
    created_by: row.created_by,
    created_by_id: row.created_by_id,
    ...JSON.parse(row.data),
  };
}

// Ce que voit réellement le lecteur : le propriétaire et les administrateurs ont tout, les autres perdent
// l'adresse e-mail de l'auteur et les champs privés (coordonnées de contact notamment).
function present(ctx, name, record) {
  if (ctx.service || isAdmin(ctx)) return record;
  const mine = ctx.user && (record.created_by_id === ctx.user.id || record.user_id === ctx.user.id);
  if (mine) return record;
  const out = { ...record };
  delete out.created_by;
  for (const field of PRIVATE_FIELDS[name] ?? []) delete out[field];
  return out;
}

function denied(ctx) {
  return ctx.user ? new HttpError(403, "Accès refusé.") : new HttpError(401, "Authentification requise.");
}

function stripProtected(ctx, name, fields) {
  if (ctx.service || isAdmin(ctx)) return fields;
  const out = { ...fields };
  for (const f of PROTECTED_FIELDS[name] ?? []) delete out[f];
  return out;
}

function stripReserved(fields) {
  const out = { ...fields };
  for (const f of COLUMNS) delete out[f];
  return out;
}

function assertBrowserAllowed(ctx, name, op) {
  if (ctx.browser && BROWSER_BLOCKED[name]?.includes(op)) {
    throw new HttpError(403, "Cette opération n'est pas autorisée depuis le navigateur.");
  }
}

async function loadRow(name, id) {
  if (typeof id !== "string" || !/^[\w-]{1,64}$/.test(id)) throw new HttpError(404, "Enregistrement introuvable.");
  const row = await db().prepare("SELECT * FROM records WHERE entity = ? AND id = ?").bind(name, id).first();
  if (!row) throw new HttpError(404, "Enregistrement introuvable.");
  return row;
}

// Garantit l'unicité des champs déclarés dans UNIQUE_FIELDS (voir entities.js) pour les champs présents dans `fields`.
async function ensureUnique(name, fields, { excludeId = "", creating }) {
  const rules = UNIQUE_FIELDS[name];
  if (!rules) return fields;
  const out = { ...fields };
  for (const [field, rule] of Object.entries(rules)) {
    const base = out[field];
    if (typeof base !== "string" || !base) continue;
    const taken = async (value) =>
      Boolean(
        await db()
          .prepare(`SELECT 1 FROM records WHERE entity = ? AND json_extract(data, '$.${field}') = ? AND id != ? LIMIT 1`)
          .bind(name, value, excludeId)
          .first(),
      );
    if (!(await taken(base))) continue;
    if (!creating && rule.onUpdate === "error") throw new HttpError(409, `La valeur « ${base} » est déjà utilisée (${field}).`);
    let candidate = base;
    for (let n = 2; n <= 50 && (await taken(candidate)); n++) candidate = `${base}-${n}`;
    if (await taken(candidate)) candidate = `${base}-${randomHex(2)}`;
    out[field] = candidate;
  }
  return out;
}

function serialize(data) {
  const text = JSON.stringify(data);
  if (text.length > MAX_RECORD_BYTES) throw new HttpError(413, "Enregistrement trop volumineux.");
  return text;
}

function createEntityApi(ctx, name) {
  const def = entityDef(name);
  const readSql = () => (ctx.service ? TRUE : compileRule(ruleFor(def, "read"), ctx.user));

  async function filter(query, a, b, c) {
    assertBrowserAllowed(ctx, name, "filter");
    await prepare(ctx);
    const { sort, limit, skip } = normalizeOptions(a, b, c);
    const q = compileQuery(query);
    const r = readSql();
    const sql = `SELECT * FROM records WHERE entity = ? AND ${q.sql} AND ${r.sql} ORDER BY ${compileSort(sort)} LIMIT ? OFFSET ?`;
    const { results } = await db()
      .prepare(sql)
      .bind(name, ...q.params, ...r.params, limit, skip)
      .all();
    return results.map((row) => present(ctx, name, hydrate(row)));
  }

  return {
    filter,

    list: (a, b, c) => filter({}, a, b, c),

    async get(id) {
      assertBrowserAllowed(ctx, name, "get");
      await prepare(ctx);
      const row = hydrate(await loadRow(name, id));
      if (!ctx.service && !evalRule(ruleFor(def, "read"), ctx.user, row)) throw denied(ctx);
      return present(ctx, name, row);
    },

    async count(query) {
      assertBrowserAllowed(ctx, name, "count");
      await prepare(ctx);
      const q = compileQuery(query);
      const r = readSql();
      const row = await db()
        .prepare(`SELECT COUNT(*) AS n FROM records WHERE entity = ? AND ${q.sql} AND ${r.sql}`)
        .bind(name, ...q.params, ...r.params)
        .first();
      return row?.n ?? 0;
    },

    async create(input) {
      assertBrowserAllowed(ctx, name, "create");
      await prepare(ctx);
      if (!input || typeof input !== "object" || Array.isArray(input)) throw new HttpError(400, "Données invalides.");
      let fields = stripReserved(input);
      fields = stripProtected(ctx, name, fields);
      fields = withDefaults(def, cleanFields(def, fields));
      assertRequired(def, fields);
      fields = await ensureUnique(name, fields, { creating: true });

      const candidate = { ...fields, created_by_id: ctx.user?.id };
      if (!ctx.service && !evalRule(ruleFor(def, "create"), ctx.user, candidate)) throw denied(ctx);

      const now = new Date().toISOString();
      const id = newId();
      await db()
        .prepare("INSERT INTO records (entity, id, data, created_date, updated_date, created_by, created_by_id) VALUES (?,?,?,?,?,?,?)")
        .bind(name, id, serialize(fields), now, now, ctx.user?.email ?? null, ctx.user?.id ?? null)
        .run();
      return present(ctx, name, hydrate({ id, data: JSON.stringify(fields), created_date: now, updated_date: now, created_by: ctx.user?.email ?? null, created_by_id: ctx.user?.id ?? null }));
    },

    async update(id, patch) {
      assertBrowserAllowed(ctx, name, "update");
      await prepare(ctx);
      const row = await loadRow(name, id);
      const current = hydrate(row);
      if (!ctx.service && !evalRule(ruleFor(def, "update"), ctx.user, current)) throw denied(ctx);

      const incoming = patch?.$set && typeof patch.$set === "object" ? patch.$set : patch;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) throw new HttpError(400, "Données invalides.");
      const changes = await ensureUnique(name, cleanFields(def, stripProtected(ctx, name, stripReserved(incoming))), { excludeId: id, creating: false });
      const data = { ...JSON.parse(row.data), ...changes };
      assertRequired(def, data);

      const now = new Date().toISOString();
      await db().prepare("UPDATE records SET data = ?, updated_date = ? WHERE entity = ? AND id = ?").bind(serialize(data), now, name, id).run();
      return present(ctx, name, hydrate({ ...row, data: JSON.stringify(data), updated_date: now }));
    },

    async updateMany(query, update) {
      assertBrowserAllowed(ctx, name, "updateMany");
      await prepare(ctx);
      const incoming = update?.$set && typeof update.$set === "object" ? update.$set : update;
      if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) throw new HttpError(400, "Données invalides.");
      const changes = cleanFields(def, stripProtected(ctx, name, stripReserved(incoming)));
      if (Object.keys(changes).length === 0) return { updated: 0 };
      const q = compileQuery(query);
      const w = ctx.service ? TRUE : compileRule(ruleFor(def, "update"), ctx.user);
      const now = new Date().toISOString();
      const res = await db()
        .prepare(`UPDATE records SET data = json_patch(data, ?), updated_date = ? WHERE entity = ? AND ${q.sql} AND ${w.sql}`)
        .bind(JSON.stringify(changes), now, name, ...q.params, ...w.params)
        .run();
      return { updated: res.meta?.changes ?? 0 };
    },

    /**
     * Import en masse (export d'une ancienne base, par exemple) — réservé au code serveur.
     * Conserve l'identifiant, les dates et l'auteur d'origine ; relancer l'import met à jour au lieu de dupliquer.
     * Tolère les exports CSV (listes en texte, nombres et booléens écrits en toutes lettres).
     */
    async importMany(records) {
      if (!ctx.service) throw new HttpError(403, "Accès refusé.");
      await prepare(ctx);
      const result = { imported: 0, skipped: [] };
      const toDate = (v) => (v && !Number.isNaN(Date.parse(v)) ? new Date(v).toISOString() : new Date().toISOString());
      for (const [index, raw] of (Array.isArray(records) ? records : []).entries()) {
        try {
          if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new HttpError(422, "Ligne invalide.");
          const input = {};
          for (const [key, value] of Object.entries(stripReserved(raw))) {
            const spec = def.properties?.[key];
            if (value === "" || value === undefined) continue;
            if (spec?.type === "array" && typeof value === "string") {
              try {
                input[key] = JSON.parse(value);
              } catch {
                input[key] = value.split(/\s*[,;]\s*/).filter(Boolean);
              }
            } else input[key] = value;
          }
          const fields = withDefaults(def, cleanFields(def, input));
          assertRequired(def, fields);
          const id = typeof raw.id === "string" && /^[\w-]{1,64}$/.test(raw.id) ? raw.id : newId();
          const created = toDate(raw.created_date);
          await db()
            .prepare(
              `INSERT INTO records (entity, id, data, created_date, updated_date, created_by, created_by_id) VALUES (?,?,?,?,?,?,?)
               ON CONFLICT(entity, id) DO UPDATE SET data = excluded.data, updated_date = excluded.updated_date`,
            )
            .bind(name, id, serialize(fields), created, toDate(raw.updated_date ?? raw.created_date), raw.created_by ?? null, raw.created_by_id ?? null)
            .run();
          result.imported += 1;
        } catch (error) {
          result.skipped.push({ index: index + 1, reason: error?.message || "Erreur" });
        }
      }
      return result;
    },

    async delete(id) {
      assertBrowserAllowed(ctx, name, "delete");
      await prepare(ctx);
      const row = await loadRow(name, id);
      if (!ctx.service && !evalRule(ruleFor(def, "delete"), ctx.user, hydrate(row))) throw denied(ctx);
      await db().prepare("DELETE FROM records WHERE entity = ? AND id = ?").bind(name, id).run();
      return { success: true };
    },
  };
}

/**
 * Accès aux entités pour un contexte donné. `entities.ArtistProfile.filter(...)` etc.
 * L'entité « User » est servie par la table des comptes (jamais de mot de passe exposé).
 */
export function createEntities(ctx) {
  const cache = new Map();
  return new Proxy(
    {},
    {
      get(_, name) {
        if (typeof name !== "string") return undefined;
        if (!cache.has(name)) cache.set(name, name === "User" ? createUsersApi(ctx) : createEntityApi(ctx, name));
        return cache.get(name);
      },
    },
  );
}

export { ADMIN_ONLY };
